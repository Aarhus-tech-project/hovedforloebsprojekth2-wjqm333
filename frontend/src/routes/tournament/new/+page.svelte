<script lang="ts">
  import { goto } from '/navigation';
  import { onMount } from 'svelte';
  import { tournamentApi, session } from '/api';
  let name = ('');
  let game = ('');
  let error = ('');
  let loading = (false);
  const games = ['Counter-Strike 2','League of Legends','Valorant','FIFA / EA FC','Rocket League','Minecraft','Andet'];
  onMount(() => { if (!session.userId) goto('/login'); });
  async function handleCreate() {
    if (!name.trim() || !game) { error = 'Udfyld navn og vælg spil.'; return; }
    loading = true; error = '';
    const r = await tournamentApi.create(name.trim(), game, session.userId);
    loading = false;
    if (!r.ok) { error = r.error; return; }
    goto('/tournament/' + r.data.id);
  }
</script>
<svelte:head><title>Opret turnering</title></svelte:head>
<div style="max-width:600px;margin:0 auto;padding:40px 24px">
  <a href="/" style="color:#4a5568;text-decoration:none;font-size:.9rem">? Dashboard</a>
  <h1 style="font-size:2.5rem;font-weight:700;margin:20px 0 4px">OPRET<br><span style="color:#00d4ff">TURNERING</span></h1>
  <div style="width:40px;height:3px;background:#00d4ff;margin-bottom:28px;border-radius:2px"></div>
  <div style="background:#111926;border:1px solid #1e2d45;border-radius:16px;padding:32px">
    {#if error}<p style="background:rgba(255,107,53,.1);border:1px solid rgba(255,107,53,.3);color:#ff8c60;padding:10px 14px;border-radius:8px;margin-bottom:16px;font-size:.9rem">{error}</p>{/if}
    <div style="margin-bottom:20px">
      <label style="display:block;font-size:.75rem;font-weight:600;color:#4a5568;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px">Turneringsnavn</label>
      <input bind:value={name} type="text" placeholder="f.eks. CS2 Weekly Cup" style="width:100%;padding:11px 14px;background:#0d1420;border:1px solid #1e2d45;border-radius:8px;color:#e2e8f0;font-size:.95rem" />
    </div>
    <div style="margin-bottom:24px">
      <label style="display:block;font-size:.75rem;font-weight:600;color:#4a5568;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px">Vælg spil</label>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:8px">
        {#each games as g}
          <button onclick={() => game = g} style="padding:9px 14px;background:{game===g ? 'rgba(0,212,255,.1)' : '#0d1420'};border:1px solid {game===g ? '#00d4ff' : '#1e2d45'};border-radius:8px;color:{game===g ? '#00d4ff' : '#4a5568'};cursor:pointer;font-size:.88rem;text-align:left">{g}</button>
        {/each}
      </div>
    </div>
    <div style="display:flex;gap:12px">
      <button onclick={handleCreate} disabled={loading} style="padding:12px 28px;background:#00d4ff;color:#080c14;border:none;border-radius:8px;font-size:1rem;font-weight:700;cursor:pointer">{loading ? 'Opretter...' : 'OPRET ?'}</button>
      <a href="/" style="padding:12px 28px;background:transparent;color:#e2e8f0;border:1px solid #1e2d45;border-radius:8px;font-size:1rem;font-weight:600;text-decoration:none">Annullér</a>
    </div>
  </div>
</div>
