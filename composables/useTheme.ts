import { ref, onMounted, watch } from 'vue';

export const useTheme = () => {
  const isDark = ref(false);

  const toggleTheme = () => {
    isDark.value = !isDark.value;
  };

  const setTheme = (dark: boolean) => {
    isDark.value = dark;
  };

  // Apply theme to document
  const applyTheme = () => {
    if (process.client) {
      if (isDark.value) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('theme', isDark.value ? 'dark' : 'light');
    }
  };

  // Load theme from localStorage
  onMounted(() => {
    if (process.client) {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        isDark.value = savedTheme === 'dark';
      } else {
        // Check system preference
        isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
      applyTheme();
    }
  });

  // Watch for changes
  watch(isDark, () => {
    applyTheme();
  });

  return {
    isDark,
    toggleTheme,
    setTheme
  };
};
