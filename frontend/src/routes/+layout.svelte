<script lang="ts">
  import '../app.css';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { getUser, logout } from '$lib/api';

  let { children } = $props();
  let user = $state<{ id: number; username: string } | null>(null);

  onMount(() => {
    user = getUser();
  });

  function handleLogout() {
    logout();
    user = null;
    goto('/login');
  }

  // Refresh user when page changes
  $effect(() => {
    $page; // track page changes
    if (typeof localStorage !== 'undefined') {
      user = getUser();
    }
  });
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&family=Rajdhani:wght@400;500;600&display=swap" rel="stylesheet" />
  <title>TournamentAPI</title>
</svelte:head>

<!-- NAV -->
<nav class="fixed top-0 left-0 right-0 z-50 border-b border-[var(--color-dim)] bg-[var(--color-night)]/90 backdrop-blur-sm">
  <div class="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
    <a href="/" class="font-display text-sm tracking-widest text-[var(--color-neon-pink)] glow-pink hover:opacity-80 transition-opacity"
       style="font-family: var(--font-display)">
      ◈ TOURNAMENT
    </a>

    <div class="flex items-center gap-4">
      {#if user}
        <span class="text-[var(--color-neon-cyan)]/60 text-sm" style="font-family: var(--font-body)">
          {user.username}
        </span>
        <a href="/tournament/opret" class="btn-cyan" style="padding: 0.35rem 0.9rem; font-size:0.65rem">
          + NY TURNERING
        </a>
        <button onclick={handleLogout} class="btn-pink" style="padding: 0.35rem 0.9rem; font-size:0.65rem">
          LOG UD
        </button>
      {:else}
        <a href="/login" class="btn-cyan" style="padding: 0.35rem 0.9rem; font-size:0.65rem">LOG IND</a>
        <a href="/register" class="btn-pink" style="padding: 0.35rem 0.9rem; font-size:0.65rem">OPRET BRUGER</a>
      {/if}
    </div>
  </div>
</nav>

<!-- PAGE CONTENT -->
<main class="pt-14 min-h-screen grid-bg">
  {@render children()}
</main>
