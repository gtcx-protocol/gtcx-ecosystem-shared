#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

class DateUtils {
  constructor() {
    this.startupTime = new Date();
    this.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    this.utcOffset = this.startupTime.getTimezoneOffset();
    
    // Cache the startup time for consistent reference
    this.cacheStartupTime();
  }

  cacheStartupTime() {
    const cacheDir = path.join(process.cwd(), '.gtcx', 'cache');
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }
    
    const startupData = {
      startupTime: this.startupTime.toISOString(),
      timezone: this.timezone,
      utcOffset: this.utcOffset,
      timestamp: Date.now()
    };
    
    fs.writeFileSync(
      path.join(cacheDir, 'startup-time.json'),
      JSON.stringify(startupData, null, 2)
    );
  }

  // Get today's date in various formats
  today(format = 'iso') {
    const now = new Date();
    
    switch (format) {
      case 'iso':
        return now.toISOString();
      case 'date':
        return now.toDateString();
      case 'short':
        return now.toLocaleDateString();
      case 'long':
        return now.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      case 'ymd':
        return now.toISOString().split('T')[0];
      case 'timestamp':
        return now.getTime();
      default:
        return now.toISOString();
    }
  }

  // Get date X days from now
  daysFromNow(days, format = 'iso') {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);
    
    return this.formatDate(futureDate, format);
  }

  // Get date X weeks from now
  weeksFromNow(weeks, format = 'iso') {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + (weeks * 7));
    
    return this.formatDate(futureDate, format);
  }

  // Get date X months from now
  monthsFromNow(months, format = 'iso') {
    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + months);
    
    return this.formatDate(futureDate, format);
  }

  // Get date X quarters from now
  quartersFromNow(quarters, format = 'iso') {
    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + (quarters * 3));
    
    return this.formatDate(futureDate, format);
  }

  // Get current quarter
  currentQuarter() {
    const month = new Date().getMonth();
    return Math.floor(month / 3) + 1;
  }

  // Get quarter start and end dates
  quarterDates(quarter = null) {
    const targetQuarter = quarter || this.currentQuarter();
    const year = new Date().getFullYear();
    
    const quarterStarts = [0, 3, 6, 9]; // January, April, July, October
    const startMonth = quarterStarts[targetQuarter - 1];
    
    const startDate = new Date(year, startMonth, 1);
    const endDate = new Date(year, startMonth + 3, 0); // Last day of the quarter
    
    return {
      start: startDate.toISOString(),
      end: endDate.toISOString(),
      startFormatted: startDate.toLocaleDateString(),
      endFormatted: endDate.toLocaleDateString()
    };
  }

  // Get fiscal year dates (assuming July-June)
  fiscalYearDates(year = null) {
    const targetYear = year || new Date().getFullYear();
    
    const startDate = new Date(targetYear, 6, 1); // July 1st
    const endDate = new Date(targetYear + 1, 5, 30); // June 30th
    
    return {
      start: startDate.toISOString(),
      end: endDate.toISOString(),
      startFormatted: startDate.toLocaleDateString(),
      endFormatted: endDate.toLocaleDateString(),
      year: targetYear
    };
  }

  // Format any date
  formatDate(date, format = 'iso') {
    if (typeof date === 'string') {
      date = new Date(date);
    }
    
    switch (format) {
      case 'iso':
        return date.toISOString();
      case 'date':
        return date.toDateString();
      case 'short':
        return date.toLocaleDateString();
      case 'long':
        return date.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      case 'ymd':
        return date.toISOString().split('T')[0];
      case 'timestamp':
        return date.getTime();
      case 'relative':
        return this.getRelativeTime(date);
      default:
        return date.toISOString();
    }
  }

  // Get relative time (e.g., "2 days ago", "in 3 weeks")
  getRelativeTime(date) {
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'today';
    } else if (diffDays === 1) {
      return 'tomorrow';
    } else if (diffDays === -1) {
      return 'yesterday';
    } else if (diffDays > 0) {
      return `in ${diffDays} days`;
    } else {
      return `${Math.abs(diffDays)} days ago`;
    }
  }

  // Get startup time info
  getStartupInfo() {
    return {
      startupTime: this.startupTime.toISOString(),
      startupTimeFormatted: this.startupTime.toLocaleString(),
      timezone: this.timezone,
      utcOffset: this.utcOffset,
      uptime: Date.now() - this.startupTime.getTime(),
      uptimeFormatted: this.formatUptime(Date.now() - this.startupTime.getTime())
    };
  }

  // Format uptime in human readable format
  formatUptime(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) {
      return `${days}d ${hours % 24}h ${minutes % 60}m`;
    } else if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  }

  // Validate if a date string is valid
  isValidDate(dateString) {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
  }

  // Parse various date formats
  parseDate(dateString) {
    if (this.isValidDate(dateString)) {
      return new Date(dateString);
    }
    
    // Try common formats
    const formats = [
      'YYYY-MM-DD',
      'MM/DD/YYYY',
      'DD/MM/YYYY',
      'MM-DD-YYYY',
      'DD-MM-YYYY'
    ];
    
    for (const format of formats) {
      const parsed = this.parseFormattedDate(dateString, format);
      if (parsed) return parsed;
    }
    
    return null;
  }

  parseFormattedDate(dateString, format) {
    // Simple parser for common formats
    const parts = dateString.split(/[\/\-]/);
    if (parts.length !== 3) return null;
    
    let year, month, day;
    
    if (format === 'YYYY-MM-DD') {
      [year, month, day] = parts;
    } else if (format === 'MM/DD/YYYY' || format === 'MM-DD-YYYY') {
      [month, day, year] = parts;
    } else if (format === 'DD/MM/YYYY' || format === 'DD-MM-YYYY') {
      [day, month, year] = parts;
    }
    
    if (year && month && day) {
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      if (this.isValidDate(date)) return date;
    }
    
    return null;
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DateUtils;
}

// If run directly, show demo
if (require.main === module) {
  const dateUtils = new DateUtils();
  
  console.log('🕐 GTCX Date Utilities Demo\n');
  
  console.log('📅 Today:', dateUtils.today('long'));
  console.log('🌅 Startup Time:', dateUtils.getStartupInfo().startupTimeFormatted);
  console.log('⏰ Uptime:', dateUtils.getStartupInfo().uptimeFormatted);
  console.log('🌍 Timezone:', dateUtils.timezone);
  
  console.log('\n📅 Future Dates:');
  console.log('   Tomorrow:', dateUtils.daysFromNow(1, 'short'));
  console.log('   Next Week:', dateUtils.weeksFromNow(1, 'short'));
  console.log('   Next Month:', dateUtils.monthsFromNow(1, 'short'));
  console.log('   Next Quarter:', dateUtils.quartersFromNow(1, 'short'));
  
  console.log('\n📊 Current Quarter:', dateUtils.currentQuarter());
  const quarterDates = dateUtils.quarterDates();
  console.log('   Quarter Dates:', quarterDates.startFormatted, 'to', quarterDates.endFormatted);
  
  const fiscalYear = dateUtils.fiscalYearDates();
  console.log('\n💰 Fiscal Year:', fiscalYear.year);
  console.log('   Fiscal Year Dates:', fiscalYear.startFormatted, 'to', fiscalYear.endFormatted);
}

module.exports = DateUtils;
