# 🎮 GTCX Quick Commands

Use these commands to rapidly navigate development tasks:

## 🚀 **Initialization Commands**

### `--start [project]`
Initialize AI assistant with comprehensive project context:
- Reviews all essential documentation
- Identifies current priorities and blockers
- Sets up daily goals and success metrics
- Provides immediate action items
Usage: `--start gtcx` or `node scripts/start-assistant.js gtcx`

### `--realitycheck`
Thorough and brutally honest assessment of entire codebase and project:
- Production-readiness evaluation (0-100%)
- Feature completion analysis across all apps
- Code quality assessment with specific issues
- Security vulnerability identification
- Performance bottleneck analysis
- 100% honest evaluation of what actually works vs. documentation claims
Usage: `node scripts/reality-check.js`

## 📅 **Daily Agile Commands**

### `--standup`
Daily standup following agile practices:
- ✅ Yesterday: What was completed
- 🔄 Today: What's in progress
- 🎯 Next: What's planned next
- 🚧 Blockers: Any issues or reprioritization needed
- 📊 Velocity: Progress against sprint goals

### `--goals`
Set and review daily goals:
- P0 priorities for today
- Specific deliverables
- Success metrics
- Time estimates

## 🚀 **Core Commands**

### `--next`
Show the next immediate P0 task that can be completed in <30 minutes

### `--status`
Display current system status:
- ✅ What's working
- 🔄 What's in progress  
- ❌ What's broken
- 📊 Production readiness %

### `--p0`
List all P0 (critical) tasks for MVP launch

### `--p1`
List all P1 (important but not blocking) tasks

### `--test`
Run the most important test right now

### `--deploy`
Deploy latest code to production

### `--fix`
Fix the most critical broken thing

## 📊 **Status Commands**

### `--health`
Check if production API is running

### `--metrics`
Show key metrics (users, uptime, response time)

### `--logs`
Show recent server logs

### `--users`
Count registered users

## 🔧 **Development Commands**

### `--todo`
Show current todo list with status

### `--complete [task]`
Mark a task as complete

### `--block`
Show current blockers

### `--time`
Estimate time for remaining P0s

### `--help`
Show this command list

## 🎯 **Quick Actions**

### `--restart`
Restart production server

### `--backup`
Backup database

### `--clean`
Clean up temp files and logs

### `--update`
Update mobile app API URLs

## 📝 **Documentation Commands**

### `--docs`
Show documentation structure

### `--readme`
Show README quick links

### `--api`
Show API endpoints

### `--errors`
Show common errors and fixes

---

## 💡 **Command Aliases**

- `--n` = `--next`
- `--s` = `--status`
- `--t` = `--test`
- `--d` = `--deploy`
- `--h` = `--health`
- `--g` = `--goals`
- `--su` = `--standup`

## 🔥 **Power Commands**

### `--ship`
Complete next task and deploy

### `--sprint`
Show what can be done in next 2 hours

### `--launch`
Show launch readiness checklist

### `--300x`
Show opportunities for 300x acceleration

---

*Type any command to execute*