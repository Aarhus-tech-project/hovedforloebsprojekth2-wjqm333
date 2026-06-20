<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { apiFetch, getUser } from '$lib/api';

  type Player = { id: number; username: string };
  type Match  = { id: number; player1: string; player2: string; winner: string; playedAt: string | null };
  type Tournament = {
    id: number; name: string; game: string; createdAt: string;
    createdBy: string; players: Player[]; matches: Match[];
  };

  let tournament = $state<Tournament | null>(null);
  let loading    = $state(true);
  let error      = $state('');
  let user       = $state<{ id: number; username: string } | null>(null);

  // Join state
  let joining    = $state(false);
  let joinMsg    = $state('');

  // New match state
  let showMatchForm = $state(false);
  let mp1 = $state(0);
  let mp2 = $state(0);
  let matchError = $state('');
  let matchLoading = $state(false);

  // Set result state
  let showResultForm = $state<number | null>(null); // match id
  let winnerId = $state(0);
  let resultLoading = $state(false);

  const id = $derived(Number($page.params.id));

  async function load() {
    loading = true; error = '';
    try {
      tournament = (await apiFetch(`/tournament/${id}`)) as Tournament;
    } catch (e: unknown) {
      error = e instanceof Error ? e.message : 'Fejl';
    } finally {
      loading = false;
    }
  }

  onMount(() => {
    user = getUser();
    load();
  });

  async function handleJoin() {
    if (!user) return;
    joining = true; joinMsg = '';
    try {
      const res = await apiFetch(`/tournament/${id}/join`, {
        method: 'POST',
        body: JSON.stringify({ userId: user.id }),
      }) as { message: string };
      joinMsg = res.message;
      await load();
    } catch (e: unknown) {
      joinMsg = e instanceof Error ? e.message : 'Fejl';
    } finally {
      joining = false;
    }
  }

  async function handleCreateMatch() {
    matchError = '';
    if (!mp1 || !mp2 || mp1 === mp2) { matchError = 'Vælg to forskellige spillere.'; return; }
    matchLoading = true;
    try {
      await apiFetch('/match', {
        method: 'POST',
        body: JSON.stringify({ tournamentId: id, player1Id: mp1, player2Id: mp2 }),
      });
      showMatchForm = false; mp1 = 0; mp2 = 0;
      await load();
    } catch (e: unknown) {
      matchError = e instanceof Error ? e.message : 'Fejl';
    } finally {
      matchLoading = false;
    }
  }

  async function handleSetResult(matchId: number) {
    if (!winnerId) return;
    resultLoading = true;
    try {
      await apiFetch(`/match/${matchId}/result`, {
        method: 'PUT',
        body: JSON.stringify({ winnerId }),
      });
      showResultForm = null; winnerId = 0;
      await load();
    } catch (e: unknown) {
      error = e instanceof Error ? e.message : 'Fejl';
    } finally {
      resultLoading = false;
    }
  }

  function formatDate(iso: string | null) {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('da-DK', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  // Is current user already joined?
  const alreadyJoined = $derived(
    user && tournament ? tournament.players.some(p => p.id === user!.id) : false
  );
</script>

<div class="max-w-5xl mx-auto px-6 py-12">

  {#if loading}
    <div class="flex justify-center py-20">
      <span class="text-[var(--color-neon-cyan)]/50 text-sm tracking-widest animate-pulse"
            style="font-family:var(--font-display)">INDLÆSER...</span>
    </div>

  {:else if error}
    <div class="neon-card p-8 text-center border-[var(--color-neon-pink)]/40">
      <p class="text-[var(--color-neon-pink)]">{error}</p>
      <a href="/" class="btn-cyan mt-4 inline-block">← TILBAGE</a>
    </div>

  {:else if tournament}
    <!-- HEADER -->
    <div class="mb-10">
      <a href="/" class="text-[var(--color-dim)] text-xs tracking-widest hover:text-[var(--color-neon-cyan)] transition-colors"
         style="font-family:var(--font-display)">← ALLE TURNERINGER</a>

      <div class="mt-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 class="text-3xl md:text-4xl font-black tracking-wider glow-pink"
              style="font-family:var(--font-display); color:var(--color-neon-pink)">
            {tournament.name}
          </h1>
          <p class="text-[var(--color-neon-purple)] mt-1" style="font-family:var(--font-body)">
            {tournament.game}
          </p>
          <p class="text-[var(--color-dim)] text-xs mt-1" style="font-family:var(--font-body)">
            Oprettet af <span class="text-[var(--color-neon-cyan)]/70">{tournament.createdBy}</span>
            · {formatDate(tournament.createdAt)}
          </p>
        </div>

        <!-- JOIN BUTTON -->
        {#if user && !alreadyJoined}
          <div class="flex flex-col items-end gap-2">
            <button onclick={handleJoin} disabled={joining} class="btn-pink">
              {joining ? 'TILMELDER...' : '+ TILMELD MIG'}
            </button>
            {#if joinMsg}
              <p class="text-[var(--color-neon-green)] text-xs">{joinMsg}</p>
            {/if}
          </div>
        {:else if alreadyJoined}
          <span class="text-[var(--color-neon-green)] text-xs tracking-widest"
                style="font-family:var(--font-display)">✓ TILMELDT</span>
        {:else if !user}
          <a href="/login" class="btn-cyan">LOG IND FOR AT TILMELDE</a>
        {/if}
      </div>
    </div>

    <div class="grid md:grid-cols-2 gap-8">

      <!-- PLAYERS -->
      <div>
        <h2 class="text-sm tracking-widest text-[var(--color-neon-cyan)]/60 mb-4"
            style="font-family:var(--font-display)">
          SPILLERE ({tournament.players.length})
        </h2>
        {#if tournament.players.length === 0}
          <div class="neon-card p-6 text-center">
            <p class="text-[var(--color-dim)] text-sm">Ingen spillere endnu</p>
          </div>
        {:else}
          <div class="space-y-2">
            {#each tournament.players as p}
              <div class="neon-card px-4 py-3 flex items-center gap-3">
                <span class="w-2 h-2 rounded-full bg-[var(--color-neon-cyan)] shadow-[0_0_8px_var(--color-neon-cyan)]"></span>
                <span class="text-[var(--color-neon-cyan)]" style="font-family:var(--font-body)">{p.username}</span>
                {#if p.id === user?.id}
                  <span class="ml-auto text-[var(--color-neon-green)] text-xs">(dig)</span>
                {/if}
              </div>
            {/each}
          </div>
        {/if}
      </div>

      <!-- MATCHES -->
      <div>
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-sm tracking-widest text-[var(--color-neon-cyan)]/60"
              style="font-family:var(--font-display)">
            KAMPE ({tournament.matches.length})
          </h2>
          {#if user && tournament.players.length >= 2}
            <button onclick={() => { showMatchForm = !showMatchForm; matchError = ''; }}
                    class="btn-cyan" style="padding:0.3rem 0.8rem; font-size:0.6rem">
              {showMatchForm ? 'ANNULLER' : '+ NY KAMP'}
            </button>
          {/if}
        </div>

        <!-- New match form -->
        {#if showMatchForm}
          <div class="neon-card p-4 mb-4 border-[var(--color-neon-cyan)]/30 space-y-3">
            <p class="text-xs tracking-widest text-[var(--color-neon-cyan)]/60"
               style="font-family:var(--font-display)">OPRET KAMP</p>
            <div>
              <label class="text-xs text-[var(--color-dim)] block mb-1"
                     style="font-family:var(--font-display)">SPILLER 1</label>
              <select bind:value={mp1} class="neon-input">
                <option value={0}>Vælg spiller...</option>
                {#each tournament.players as p}
                  <option value={p.id}>{p.username}</option>
                {/each}
              </select>
            </div>
            <div>
              <label class="text-xs text-[var(--color-dim)] block mb-1"
                     style="font-family:var(--font-display)">SPILLER 2</label>
              <select bind:value={mp2} class="neon-input">
                <option value={0}>Vælg spiller...</option>
                {#each tournament.players as p}
                  <option value={p.id}>{p.username}</option>
                {/each}
              </select>
            </div>
            {#if matchError}
              <p class="text-[var(--color-neon-pink)] text-xs">{matchError}</p>
            {/if}
            <button onclick={handleCreateMatch} disabled={matchLoading} class="btn-pink w-full">
              {matchLoading ? '...' : 'OPRET KAMP'}
            </button>
          </div>
        {/if}

        <!-- Match list -->
        {#if tournament.matches.length === 0}
          <div class="neon-card p-6 text-center">
            <p class="text-[var(--color-dim)] text-sm">Ingen kampe endnu</p>
          </div>
        {:else}
          <div class="space-y-3">
            {#each tournament.matches as m}
              <div class="neon-card p-4">
                <div class="flex items-center justify-between">
                  <div class="text-sm" style="font-family:var(--font-body)">
                    <span class="text-[var(--color-neon-cyan)]">{m.player1}</span>
                    <span class="text-[var(--color-dim)] mx-2">VS</span>
                    <span class="text-[var(--color-neon-cyan)]">{m.player2}</span>
                  </div>
                </div>

                <div class="mt-2 flex items-center justify-between">
                  {#if m.winner !== 'Ikke spillet endnu'}
                    <span class="text-[var(--color-neon-green)] text-xs"
                          style="font-family:var(--font-display)">
                      ✓ {m.winner}
                    </span>
                    <span class="text-[var(--color-dim)] text-xs">{formatDate(m.playedAt)}</span>
                  {:else}
                    <span class="text-[var(--color-dim)] text-xs italic">Ikke spillet endnu</span>
                    {#if user}
                      <button onclick={() => {
                                showResultForm = showResultForm === m.id ? null : m.id;
                                winnerId = 0;
                              }}
                              class="btn-cyan" style="padding:0.25rem 0.7rem; font-size:0.6rem">
                        REGISTRER RESULTAT
                      </button>
                    {/if}
                  {/if}
                </div>

                <!-- Result form inline -->
                {#if showResultForm === m.id}
                  <div class="mt-3 pt-3 border-t border-[var(--color-dim)] space-y-2">
                    <p class="text-xs text-[var(--color-dim)]" style="font-family:var(--font-display)">VÆLG VINDER</p>
                    <div class="flex gap-2">
                      {#each tournament.players.filter(p => p.username === m.player1 || p.username === m.player2) as p}
                        <button onclick={() => winnerId = p.id}
                                class="flex-1 py-2 rounded border text-sm transition-all cursor-pointer"
                                style="font-family:var(--font-body);
                                       border-color:{winnerId===p.id?'var(--color-neon-green)':'var(--color-dim)'};
                                       color:{winnerId===p.id?'var(--color-neon-green)':'var(--color-dim)'};">
                          {p.username}
                        </button>
                      {/each}
                    </div>
                    <button onclick={() => handleSetResult(m.id)} disabled={!winnerId || resultLoading}
                            class="btn-pink w-full" style="font-size:0.65rem; padding:0.4rem">
                      {resultLoading ? '...' : 'GEM RESULTAT'}
                    </button>
                  </div>
                {/if}
              </div>
            {/each}
          </div>
        {/if}
      </div>
    </div>
  {/if}
</div>
