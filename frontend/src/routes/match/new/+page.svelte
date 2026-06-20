<script lang="ts">
  import { page } from '/state';
  import { goto } from '/navigation';
  import { onMount } from 'svelte';
  import { tournamentApi, matchApi, session } from '/api';
  let tournament = (null);
  let loading = (true);
  let p1 = ('');
  let p2 = ('');
  let error = ('');
  let submitting = (false);
  let tid = (parseInt(page.url.searchParams.get('tournamentId') ?? '0'));
  onMount(async () => {
    if (!session.userId) { goto('/login'); return; }
    const r = await tournamentApi.getById(tid);
    loading = false;
    if (r.ok) tournament = r.data; else error = r.error;
  });
  async function handleCreate() {
    if (!p1 || !p2) { error = 'Vælg to spillere.'; return; }
    if (p1 === p2) { error = 'Vælg to forskellige spillere.'; return; }
    submitting = true; error = '';
    const r = await matchApi.create(tid, parseInt(p1), parseInt(p2));
    submitting = false;
    if (!r.ok) { error = r.error; return; }
    goto('/tournament/' + tid);
  }
</script>
<svelte:head><title>Opret kamp</title></svelte:head>
<div style="max-width:560px;margin:0 auto;padding:40px 24px">
  <a href="/tournament/{tid}" style="color:#4a5568;text-decoration:none;font-size:.9rem">? Tilbage til turnering</a>
  <h1 style="font-size:2.5rem;font-weight:700;margin:20px 0 4px">OPRET<br><span style="color:#ff6b35">KAMP</span></h1>
  <div style="width:40px;height:3px;background:#ff6b35;margin-bottom:28px;border-radius:2px"></div>
  {#if loading}<p style="color:#4a5568">Henter spillere...</p>
  {:else if tournament}
    <div style="background:#111926;border:1px solid #1e2d45;border-radius:16px;padding:32px">
      <div style="background:#0d1420;border:1px solid #1e2d45;border-radius:8px;padding:10px 14px;margin-bottom:20px;font-size:.9rem">
        <span style="color:#4a5568">Turnering: </span><span style="font-weight:600">{tournament.name}</span>
      </div>
      {#if error}<p style="background:rgba(255,107,53,.1);border:1px solid rgba(255,107,53,.3);color:#ff8c60;padding:10px 14px;border-radius:8px;margin-bottom:16px;font-size:.9rem">{error}</p>{/if}
      {#if (tournament.players?.length ?? 0) < 2}
        <p style="color:#ff6b35">Der skal være mindst 2 spillere tilmeldt for at oprette en kamp.</p>
      {:else}
        <div style="display:grid;grid-template-columns:1fr auto 1fr;gap:12px;align-items:end;margin-bottom:24px">
          <div>
            <label style="display:block;font-size:.75rem;font-weight:600;color:#4a5568;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px">Spiller 1</label>
            <select bind:value={p1} style="width:100%;padding:11px 14px;background:#0d1420;border:1px solid #1e2d45;border-radius:8px;color:#e2e8f0;font-size:.95rem">
              <option value="">Vælg...</option>
              {#each tournament.players as p}<option value={String(p.id)}>{p.username}</option>{/each}
            </select>
          </div>
          <div style="padding-bottom:14px;color:#4a5568;font-weight:700;font-family:monospace">VS</div>
          <div>
            <label style="display:block;font-size:.75rem;font-weight:600;color:#4a5568;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px">Spiller 2</label>
            <select bind:value={p2} style="width:100%;padding:11px 14px;background:#0d1420;border:1px solid #1e2d45;border-radius:8px;color:#e2e8f0;font-size:.95rem">
              <option value="">Vælg...</option>
              {#each tournament.players as p}<option value={String(p.id)}>{p.username}</option>{/each}
            </select>
          </div>
        </div>
        <div style="display:flex;gap:12px">
          <button onclick={handleCreate} disabled={submitting} style="padding:12px 28px;background:#ff6b35;color:#fff;border:none;border-radius:8px;font-size:1rem;font-weight:700;cursor:pointer">{submitting ? 'Opretter...' : 'OPRET KAMP'}</button>
          <a href="/tournament/{tid}" style="padding:12px 28px;background:transparent;color:#e2e8f0;border:1px solid #1e2d45;border-radius:8px;font-size:1rem;font-weight:600;text-decoration:none">Annullér</a>
        </div>
      {/if}
    </div>
  {/if}
</div>
