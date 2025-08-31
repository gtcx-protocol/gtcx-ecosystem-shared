<template>
  <div id="app">
    <el-container style="height: 100vh">
      <!-- Sidebar Navigation -->
      <el-aside width="250px" class="sidebar">
        <div class="logo-container">
          <h2>GTCX Admin</h2>
          <p>Ghana Mining Portal</p>
        </div>
        
        <el-menu
          :default-active="$route.path"
          router
          background-color="#001529"
          text-color="#fff"
          active-text-color="#1890ff"
          class="sidebar-menu"
        >
          <el-menu-item index="/dashboard">
            <el-icon><House /></el-icon>
            <span>Dashboard</span>
          </el-menu-item>
          
          <el-sub-menu index="/mining">
            <template #title>
              <el-icon><Location /></el-icon>
              <span>Mining Operations</span>
            </template>
            <el-menu-item index="/mining/operations">Active Operations</el-menu-item>
            <el-menu-item index="/mining/permits">Permit Verification</el-menu-item>
            <el-menu-item index="/mining/compliance">Compliance Reports</el-menu-item>
          </el-sub-menu>
          
          <el-sub-menu index="/trading">
            <template #title>
              <el-icon><ShoppingCart /></el-icon>
              <span>Gold Trading</span>
            </template>
            <el-menu-item index="/trading/lots">Gold Lots</el-menu-item>
            <el-menu-item index="/trading/transactions">Transactions</el-menu-item>
            <el-menu-item index="/trading/certificates">Certificates</el-menu-item>
          </el-sub-menu>
          
          <el-sub-menu index="/users">
            <template #title>
              <el-icon><User /></el-icon>
              <span>User Management</span>
            </template>
            <el-menu-item index="/users/miners">Miners</el-menu-item>
            <el-menu-item index="/users/traders">Traders</el-menu-item>
            <el-menu-item index="/users/officials">Officials</el-menu-item>
          </el-sub-menu>
          
          <el-menu-item index="/analytics">
            <el-icon><PieChart /></el-icon>
            <span>Analytics</span>
          </el-menu-item>
          
          <el-menu-item index="/settings">
            <el-icon><Setting /></el-icon>
            <span>Settings</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <!-- Main Content Area -->
      <el-container>
        <!-- Header -->
        <el-header class="header">
          <div class="header-left">
            <h3>{{ pageTitle }}</h3>
          </div>
          <div class="header-right">
            <el-dropdown>
              <span class="user-dropdown">
                <el-avatar size="small" :src="userAvatar"></el-avatar>
                {{ userName }}
                <el-icon><CaretBottom /></el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>Profile</el-dropdown-item>
                  <el-dropdown-item>Settings</el-dropdown-item>
                  <el-dropdown-item divided @click="logout">Logout</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-header>

        <!-- Main Content -->
        <el-main class="main-content">
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'App',
  computed: {
    ...mapGetters(['userName', 'userAvatar']),
    pageTitle() {
      const titleMap = {
        '/dashboard': 'Dashboard Overview',
        '/mining/operations': 'Mining Operations',
        '/mining/permits': 'Permit Verification', 
        '/mining/compliance': 'Compliance Reports',
        '/trading/lots': 'Gold Lots Management',
        '/trading/transactions': 'Trading Transactions',
        '/trading/certificates': 'Certificate Management',
        '/users/miners': 'Miner Management',
        '/users/traders': 'Trader Management', 
        '/users/officials': 'Official Management',
        '/analytics': 'Analytics & Reports',
        '/settings': 'System Settings'
      }
      return titleMap[this.$route.path] || 'GTCX Admin Portal'
    }
  },
  methods: {
    logout() {
      this.$store.dispatch('auth/logout')
      this.$router.push('/login')
    }
  }
}
</script>

<style>
#app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  height: 100vh;
}

.sidebar {
  background-color: #001529 !important;
}

.logo-container {
  text-align: center;
  padding: 20px;
  color: white;
  border-bottom: 1px solid #2c3e50;
}

.logo-container h2 {
  margin: 0;
  color: #1890ff;
  font-size: 20px;
}

.logo-container p {
  margin: 5px 0 0 0;
  font-size: 12px;
  opacity: 0.7;
}

.sidebar-menu {
  border: none;
}

.header {
  background: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.header h3 {
  margin: 0;
  color: #2c3e50;
}

.user-dropdown {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: #2c3e50;
}

.main-content {
  background-color: #f5f5f5;
  padding: 20px;
}
</style>