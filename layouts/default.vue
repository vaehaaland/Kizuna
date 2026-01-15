<template>
  <div class="min-h-screen bg-[var(--bg-app)]">
    <nav class="bg-[var(--bg-surface)] border-b border-[var(--text-muted)]/20 backdrop-blur-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <h1 class="text-2xl font-bold text-[var(--primary)]">Kizuna</h1>
            </div>
            <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
              <NuxtLink
                to="/"
                class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors"
                :class="$route.path === '/' ? 'border-[var(--primary)] text-[var(--text-primary)]' : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-muted)]'"
              >
                Inbox
              </NuxtLink>
              <NuxtLink
                to="/today"
                class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors"
                :class="$route.path === '/today' ? 'border-[var(--primary)] text-[var(--text-primary)]' : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-muted)]'"
              >
                Today
              </NuxtLink>
              <NuxtLink
                to="/projects"
                class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors"
                :class="$route.path === '/projects' ? 'border-[var(--primary)] text-[var(--text-primary)]' : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-muted)]'"
              >
                Projects
              </NuxtLink>
              <NuxtLink
                to="/settings"
                class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors"
                :class="$route.path === '/settings' ? 'border-[var(--primary)] text-[var(--text-primary)]' : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-muted)]'"
              >
                Settings
              </NuxtLink>
            </div>
          </div>
          <div class="flex items-center">
            <button
              @click="toggleTheme"
              class="p-2 rounded-[var(--radius-md)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)] transition-all"
              aria-label="Toggle theme"
            >
              <svg v-if="!isDark" class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
              <svg v-else class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
    <main>
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const { isDark, toggleTheme } = useTheme();
</script>
