<script lang="ts">
  import { onMount } from 'svelte';
  import { apiFetch, getUser } from '$lib/api';
  import { goto } from '$app/navigation';

  type Tournament = {
    id: number;
    name: string;
    game: string;
    createdAt: string;
    createdBy: string;
    playerCount: number;
  };

  let tournaments = $state<Tournament[]>([]);
  let loading = $state(true);
  let error = $state('');
  let user = $state<{ id: number; username: string } | null>(null);

  onMount(async () => {
    user = getUser();
    try {
      tournaments = (await apiFetch('/tournament')) as Tournament[];
    } catch (e: unknown) {
      error = e instanceof Error ? e.message : 'Fejl ved hentning';
    } finally {
      loading = false;
    }
  });

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('da-DK', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  }
</script>

<div class="max-w-5xl mx-auto px-6 py-12">

  <!-- HERO -->
  <div class="mb-12 text-center">
    <div class="text-[var(--color-dim)] text-xs tracking-[0.3em] mb-3" style="font-family:var(--font-display)">
      ◈ ◈ ◈
    </div>
    <h1 class="text-4xl md:text-5xl font-black tracking-wider glow-pink mb-3"
        style="font-family:var(--font-display); color: var(--color-neon-pink)">
      TURNERINGER
    </h1>
    <p class="text-[var(--color-neon-cyan)]/50 text-sm tracking-widest" style="font-family:var(--font-body)">
      Alle aktive turneringer
    </p>
  </div>

  <!-- ACTION BAR -->
  <div class="flex items-center justify-between mb-8">
    <div class="text-[var(--color-dim)] text-sm" style="font-family:var(--font-body)">
      {#if !loading}
        <span class="text-[var(--color-neon-cyan)]">{tournaments.length}</span> turneringer fundet
      {/if}
    </div>
    {#if user}
      <a href="/tournament/opret" class="btn-pink">+ OPRET TURNERING</a>
    {:else}
      <a href="/login" class="btn-cyan">LOG IND FOR AT OPRETTE</a>
    {/if}
  </div>

  <!-- LOADING -->
  {#if loading}
    <div class="flex justify-center py-20">
      <div class="text-[var(--color-neon-cyan)]/50 text-sm tracking-widest animate-pulse"
           style="font-family:var(--font-display)">
        INDLÆSER...
      </div>
    </div>

  {:else if error}
    <div class="neon-card p-6 border-[var(--color-neon-pink)]/50 text-center">
      <p class="text-[var(--color-neon-pink)] text-sm">{error}</p>
      <p class="text-[var(--color-dim)] text-xs mt-2">Er backend'en startet? (http://localhost:5000)</p>
    </div>

  {:else if tournaments.length === 0}
    <div class="neon-card p-16 text-center">
      <div class="text-5xl mb-4 opacity-20">◈</div>
      <p class="text-[var(--color-dim)] text-sm tracking-widest" style="font-family:var(--font-display)">
        INGEN TURNERINGER ENDNU
      </p>
      {#if user}
        <a href="/tournament/opret" class="btn-pink mt-6 inline-block">VÆR DEN FØRSTE</a>
      {/if}
    </div>

  {:else}
    <!-- TOURNAMENT GRID -->
    <div class="grid gap-4 md:grid-cols-2">
      {#each tournaments as t}
        <a href="/tournament/{t.id}" class="neon-card p-5 block group cursor-pointer no-underline">
          <div class="flex items-start justify-between mb-3">
            <div>
              <h2 class="text-lg font-semibold text-[var(--color-neon-cyan)] group-hover:glow-cyan transition-all"
                  style="font-family:var(--font-display); font-size:0.95rem; letter-spacing:0.05em">
                {t.name}
              </h2>
              <p class="text-[var(--color-neon-purple)] text-sm mt-0.5" style="font-family:var(--font-body)">
                {t.game}
              </p>
            </div>
            <span class="text-[var(--color-neon-pink)] text-xs border border-[var(--color-neon-pink)]/40 px-2 py-1 rounded"
                  style="font-family:var(--font-display)">
              {t.playerCount} ◈
            </span>
          </div>

          <div class="flex items-center justify-between mt-4 pt-3 border-t border-[var(--color-dim)]">
            <span class="text-[var(--color-dim)] text-xs" style="font-family:var(--font-body)">
              af <span class="text-[var(--color-neon-cyan)]/60">{t.createdBy}</span>
            </span>
            <span class="text-[var(--color-dim)] text-xs">{formatDate(t.createdAt)}</span>
          </div>
        </a>
      {/each}
    </div>
  {/if}

</div>
