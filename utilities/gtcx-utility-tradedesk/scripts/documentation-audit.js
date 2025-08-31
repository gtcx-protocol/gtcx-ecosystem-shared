#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const DateUtils = require('./date-utils');

class DocumentationAuditor {
  constructor() {
    this.dateUtils = new DateUtils();
    this.standards = {
      requiredFields: ['Purpose', 'Status', 'Created', 'Last Updated', 'Next Review'],
      statusValues: ['Active Standard', 'Active Development', 'Planning Phase', 'Deprecated', 'Draft'],
      dateFormat: /^[A-Za-z]+ \d{4}$/, // Month Year format
      quarterFormat: /Q[1-4] \d{4}/ // Q1 2025 format
    };
    
    this.auditResults = {
      totalFiles: 0,
      compliantFiles: 0,
      nonCompliantFiles: [],
      issues: [],
      recommendations: []
    };
  }

  async auditAllDocumentation() {
    console.log('🔍 **GTCX Documentation Audit**\n');
    
    const rootDir = process.cwd();
    const docsToAudit = [
      { path: 'README.md', type: 'Root README' },
      { path: 'apps/launchpad/readme.md', type: 'Launchpad README' },
      { path: 'apps/launchpad/spec.md', type: 'Launchpad Spec' },
      { path: 'apps/launchpad/cli_spec.md', type: 'CLI Spec' },
      { path: 'apps/launchpad/web_spec.md', type: 'Web Spec' },
      { path: 'apps/launchpad/generator_spec.md', type: 'Generator Spec' },
      { path: 'apps/launchpad/development-roadmap.md', type: 'Development Roadmap' },
      { path: 'services/README.md', type: 'Services README' },
      { path: 'services/service-template/README.md', type: 'Service Template README' },
      { path: 'product/README.md', type: 'Product README' },
      { path: 'data/README.md', type: 'Data README' },
      { path: 'agentic/gtcx-agentic-architecture.md', type: 'Agentic Architecture' },
      { path: 'agentic/gtcx-business-requirements.md', type: 'Business Requirements' },
      { path: 'agentic/gtcx-software-dev-guide.md', type: 'Software Dev Guide' },
      { path: 'docs/standards/documentation-standards.md', type: 'Documentation Standards' },
      { path: 'docs/templates/README-template.md', type: 'README Template' }
    ];

    for (const doc of docsToAudit) {
      await this.auditDocument(doc.path, doc.type);
    }

    this.generateAuditReport();
    this.saveAuditResults();
  }

  async auditDocument(filePath, docType) {
    this.auditResults.totalFiles++;
    
    if (!fs.existsSync(filePath)) {
      this.auditResults.nonCompliantFiles.push({
        file: filePath,
        type: docType,
        issues: ['File not found']
      });
      return;
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const issues = [];
    const recommendations = [];

    // Check header compliance
    const headerIssues = this.checkHeaderCompliance(content, filePath);
    issues.push(...headerIssues);

    // Check date consistency
    const dateIssues = this.checkDateConsistency(content, filePath);
    issues.push(...dateIssues);

    // Check formatting consistency
    const formattingIssues = this.checkFormattingConsistency(content, filePath);
    issues.push(...formattingIssues);

    // Check for change log
    const changeLogIssues = this.checkChangeLog(content, filePath);
    issues.push(...changeLogIssues);

    // Generate recommendations
    const docRecommendations = this.generateRecommendations(content, filePath, docType);
    recommendations.push(...docRecommendations);

    if (issues.length === 0) {
      this.auditResults.compliantFiles++;
    } else {
      this.auditResults.nonCompliantFiles.push({
        file: filePath,
        type: docType,
        issues,
        recommendations
      });
    }

    this.auditResults.issues.push(...issues);
    this.auditResults.recommendations.push(...recommendations);
  }

  checkHeaderCompliance(content, filePath) {
    const issues = [];
    
    // Check for required header fields
    this.standards.requiredFields.forEach(field => {
      const regex = new RegExp(`\\*\\*${field}\\*\\*\\s*:\\s*[^\\n]+`, 'i');
      if (!regex.test(content)) {
        issues.push(`Missing required header field: ${field}`);
      }
    });

    // Check status values
    const statusMatch = content.match(/\*\*Status\*\*\s*:\s*([^\n]+)/i);
    if (statusMatch) {
      const status = statusMatch[1].trim();
      if (!this.standards.statusValues.includes(status)) {
        issues.push(`Invalid status value: "${status}". Must be one of: ${this.standards.statusValues.join(', ')}`);
      }
    }

    // Check date format
    const dateMatches = content.match(/\*\*(?:Created|Last Updated|Next Review)\*\*\s*:\s*([^\n]+)/gi);
    if (dateMatches) {
      dateMatches.forEach(match => {
        const date = match.split(':')[1].trim();
        if (!this.standards.dateFormat.test(date)) {
          issues.push(`Invalid date format: "${date}". Must be "Month Year" format (e.g., "August 2025")`);
        }
      });
    }

    return issues;
  }

  checkDateConsistency(content, filePath) {
    const issues = [];
    
    // Check for outdated dates
    const currentYear = new Date().getFullYear();
    const yearMatches = content.match(/\*\*(?:Created|Last Updated|Next Review)\*\*\s*:\s*[A-Za-z]+\s+(\d{4})/gi);
    
    if (yearMatches) {
      yearMatches.forEach(match => {
        const year = parseInt(match.match(/\d{4}/)[0]);
        if (year < currentYear - 1) {
          issues.push(`Potentially outdated date: ${match.trim()}. Consider updating if content is current.`);
        }
      });
    }

    // Check for future dates in "Last Updated"
    const lastUpdatedMatch = content.match(/\*\*Last Updated\*\*\s*:\s*([^\n]+)/i);
    if (lastUpdatedMatch) {
      const dateStr = lastUpdatedMatch[1].trim();
      const date = this.parseDate(dateStr);
      if (date && date > new Date()) {
        issues.push(`Last Updated date is in the future: "${dateStr}"`);
      }
    }

    // Check quarter references
    const quarterMatches = content.match(/Q[1-4]\s+\d{4}/g);
    if (quarterMatches) {
      quarterMatches.forEach(match => {
        if (!this.standards.quarterFormat.test(match)) {
          issues.push(`Invalid quarter format: "${match}". Must be "Q1 2025" format.`);
        }
      });
    }

    return issues;
  }

  checkFormattingConsistency(content, filePath) {
    const issues = [];
    
    // Check for consistent emoji usage
    const emojiCount = (content.match(/[🕐📚🎯📋📅🔄📁🏗️📊🔍🚀📝📞🔧]/g) || []).length;
    if (emojiCount === 0) {
      issues.push('No emojis found. Consider adding strategic emojis for visual organization.');
    }

    // Check for proper section headers
    const hasH1 = /^#\s+.+$/m.test(content);
    const hasH2 = /^##\s+.+$/m.test(content);
    
    if (!hasH1) {
      issues.push('Missing H1 header (# Title)');
    }
    if (!hasH2) {
      issues.push('Missing H2 headers (## Section)');
    }

    // Check for proper table formatting
    const tableRows = content.match(/\|.+\|/g);
    if (tableRows && tableRows.length > 0) {
      const headerRow = tableRows[0];
      const separatorRow = tableRows[1];
      
      if (!separatorRow || !separatorRow.includes('---')) {
        issues.push('Table missing separator row (| --- | --- |)');
      }
    }

    return issues;
  }

  checkChangeLog(content, filePath) {
    const issues = [];
    
    // Check if change log exists
    const hasChangeLog = /##\s+\*\*Change Log\*\*/i.test(content);
    if (!hasChangeLog) {
      issues.push('Missing Change Log section');
    } else {
      // Check change log format
      const changeLogTable = content.match(/\|\s*Date\s*\|\s*Version\s*\|\s*Author\s*\|\s*Changes\s*\|/i);
      if (!changeLogTable) {
        issues.push('Change Log missing proper table format');
      }
    }

    return issues;
  }

  generateRecommendations(content, filePath, docType) {
    const recommendations = [];
    
    // Check file naming
    if (filePath.includes('README') && !filePath.includes('README.md')) {
      recommendations.push('Consider renaming to README.md for consistency');
    }

    // Check for missing sections
    const sections = ['Overview', 'Quick Start', 'Architecture', 'Documentation', 'Testing', 'Deployment'];
    sections.forEach(section => {
      if (!content.includes(`## ${section}`) && !content.includes(`## **${section}**`)) {
        recommendations.push(`Consider adding "${section}" section for completeness`);
      }
    });

    // Check for metadata
    if (!content.includes('---') || content.split('---').length < 2) {
      recommendations.push('Consider adding front matter or metadata section');
    }

    return recommendations;
  }

  parseDate(dateStr) {
    // Simple date parser for Month Year format
    const months = {
      'january': 0, 'february': 1, 'march': 2, 'april': 3, 'may': 4, 'june': 5,
      'july': 6, 'august': 7, 'september': 8, 'october': 9, 'november': 10, 'december': 11
    };
    
    const match = dateStr.match(/^([A-Za-z]+)\s+(\d{4})$/);
    if (match) {
      const month = months[match[1].toLowerCase()];
      const year = parseInt(match[2]);
      if (month !== undefined) {
        return new Date(year, month, 1);
      }
    }
    
    return null;
  }

  generateAuditReport() {
    console.log(`📊 **Audit Summary**\n`);
    console.log(`📁 Total Files: ${this.auditResults.totalFiles}`);
    console.log(`✅ Compliant Files: ${this.auditResults.compliantFiles}`);
    console.log(`❌ Non-Compliant Files: ${this.auditResults.nonCompliantFiles.length}`);
    console.log(`🔍 Total Issues: ${this.auditResults.issues.length}`);
    console.log(`💡 Total Recommendations: ${this.auditResults.recommendations.length}\n`);

    if (this.auditResults.nonCompliantFiles.length > 0) {
      console.log('❌ **Non-Compliant Files**\n');
      
      this.auditResults.nonCompliantFiles.forEach(file => {
        console.log(`📄 **${file.type}** (${file.file})`);
        if (file.issues.length > 0) {
          console.log('   Issues:');
          file.issues.forEach(issue => console.log(`   • ${issue}`));
        }
        if (file.recommendations.length > 0) {
          console.log('   Recommendations:');
          file.recommendations.forEach(rec => console.log(`   • ${rec}`));
        }
        console.log('');
      });
    }

    if (this.auditResults.recommendations.length > 0) {
      console.log('💡 **General Recommendations**\n');
      const uniqueRecs = [...new Set(this.auditResults.recommendations)];
      uniqueRecs.forEach(rec => console.log(`• ${rec}`));
      console.log('');
    }

    const complianceRate = ((this.auditResults.compliantFiles / this.auditResults.totalFiles) * 100).toFixed(1);
    console.log(`📈 **Compliance Rate: ${complianceRate}%**\n`);
  }

  saveAuditResults() {
    const auditDir = path.join(process.cwd(), '.gtcx', 'audits');
    if (!fs.existsSync(auditDir)) {
      fs.mkdirSync(auditDir, { recursive: true });
    }
    
    const timestamp = this.dateUtils.today('ymd');
    const filename = `documentation-audit-${timestamp}.json`;
    const filepath = path.join(auditDir, filename);
    
    const auditData = {
      timestamp: this.dateUtils.today('iso'),
      summary: {
        totalFiles: this.auditResults.totalFiles,
        compliantFiles: this.auditResults.compliantFiles,
        nonCompliantFiles: this.auditResults.nonCompliantFiles.length,
        totalIssues: this.auditResults.issues.length,
        totalRecommendations: this.auditResults.recommendations.length,
        complianceRate: ((this.auditResults.compliantFiles / this.auditResults.totalFiles) * 100).toFixed(1)
      },
      details: this.auditResults
    };
    
    fs.writeFileSync(filepath, JSON.stringify(auditData, null, 2));
    console.log(`💾 Audit results saved to: ${filepath}`);
  }
}

// Run audit if called directly
if (require.main === module) {
  const auditor = new DocumentationAuditor();
  auditor.auditAllDocumentation().catch(console.error);
}

module.exports = DocumentationAuditor;
