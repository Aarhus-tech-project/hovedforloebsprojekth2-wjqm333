<script lang="ts">
  import { onMount } from 'svelte';
  import { apiFetch, getUser } from '$lib/api';
  import { goto } from '$app/navigation';

  let name    = $state('');
  let game    = $state('');
  let error   = $state('');
  let loading = $state(false);

  const GAMES = ['Counter-Strike 2', 'League of Legends', 'Valorant', 'FIFA', 'Rocket League', 'Minecraft', 'Fortnite', 'Other'];

  onMount(() => {
    if (!getUser()) goto('/login');
  });

  async function handleCreate() {
    error = '';
    const user = getUser();
    if (!user) { goto('/login'); return; }
    if (!name.trim() || !game.trim()) { error = 'Udfyld navn og spil.'; return; }

    loading = true;
    try {
      const data = await apiFetch('/tournament', {
        method: 'POST',
        body: JSON.stringify({ name: name.trim(), game: game.trim(), createdByUserId: user.id }),
      }) as { id: number };
      goto(`/tournament/${data.id}`);
    } catch (e: unknown) {
      error = e instanceof Error ? e.message : 'Oprettelse fejlede';
    } finally {
      loading = false;
    }
  }
</script>

<div class="min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4">
  <div class="w-full max-w-md">

    <div class="text-center mb-10">
      <div class="text-[var(--color-neon-purple)] text-3xl mb-3">◈</div>
      <h1 class="text-2xl font-black tracking-widest glow-purple"
          style="font-family:var(--font-display); color:var(--color-neon-purple)">
        NY TURNERING
      </h1>
      <p class="text-[var(--color-dim)] text-xs mt-2 tracking-widest" style="font-family:var(--font-body)">
        Opret en ny turnering
      </p>
    </div>

    <div class="neon-card p-7 space-y-6">
      <div>
        <label class="block text-xs tracking-widest text-[var(--color-neon-cyan)]/60 mb-2"
               style="font-family:var(--font-display)">TURNERINGENS NAVN</label>
        <input bind:value={name} type="text" placeholder="Fx: Sommer Cup 2026" class="neon-input" />
      </div>

      <div>
        <label class="block text-xs tracking-widest text-[var(--color-neon-cyan)]/60 mb-2"
               style="font-family:var(--font-display)">SPIL</label>
        <input bind:value={game} type="text" placeholder="Fx: Counter-Strike 2" class="neon-input"
               list="games-list" />
        <datalist id="games-list">
          {#each GAMES as g}<option value={g}>{g}</option>{/each}
        </datalist>

        <!-- Quick-pick buttons -->
        <div class="flex flex-wrap gap-2 mt-3">
          {#each GAMES.slice(0, 6) as g}
            <button onclick={() => game = g}
                    class="text-xs px-2.5 py-1 rounded border transition-all cursor-pointer"
                    style="font-family:var(--font-body);
                           border-color: {game === g ? 'var(--color-neon-cyan)' : 'var(--color-dim)'};
                           color: {game === g ? 'var(--color-neon-cyan)' : 'var(--color-dim)'};">
              {g}
            </button>
          {/each}
        </div>
      </div>

      {#if error}
        <p class="text-[var(--color-neon-pink)] text-sm text-center">{error}</p>
      {/if}

      <div class="flex gap-3 pt-2">
        <a href="/" class="btn-cyan flex-1 text-center" style="text-decoration:none; display:block; text-align:center">
          ANNULLER
        </a>
        <button onclick={handleCreate} disabled={loading} class="btn-pink flex-1">
          {loading ? 'OPRETTER...' : 'OPRET'}
        </button>
      </div>
    </div>

  </div>
</div>
