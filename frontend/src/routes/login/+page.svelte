<script lang="ts">
  import { apiFetch, setUser } from '$lib/api';
  import { goto } from '$app/navigation';

  let username = $state('');
  let password = $state('');
  let error = $state('');
  let loading = $state(false);

  async function handleLogin() {
    error = '';
    if (!username || !password) { error = 'Udfyld alle felter.'; return; }
    loading = true;
    try {
      const data = await apiFetch('/user/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      }) as { id: number; username: string };
      setUser({ id: data.id, username: data.username });
      goto('/');
    } catch (e: unknown) {
      error = e instanceof Error ? e.message : 'Login fejlede';
    } finally {
      loading = false;
    }
  }
</script>

<div class="min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4">
  <div class="w-full max-w-sm">

    <!-- HEADER -->
    <div class="text-center mb-10">
      <div class="text-[var(--color-neon-pink)] text-3xl mb-3">◈</div>
      <h1 class="text-2xl font-black tracking-widest glow-pink"
          style="font-family:var(--font-display); color:var(--color-neon-pink)">
        LOG IND
      </h1>
      <p class="text-[var(--color-dim)] text-xs mt-2 tracking-widest" style="font-family:var(--font-body)">
        Velkommen tilbage
      </p>
    </div>

    <!-- FORM -->
    <div class="neon-card p-7 space-y-5">
      <div>
        <label class="block text-xs tracking-widest text-[var(--color-neon-cyan)]/60 mb-2"
               style="font-family:var(--font-display)">BRUGERNAVN</label>
        <input bind:value={username} type="text" placeholder="dit_brugernavn"
               class="neon-input" onkeydown={(e) => e.key === 'Enter' && handleLogin()} />
      </div>

      <div>
        <label class="block text-xs tracking-widest text-[var(--color-neon-cyan)]/60 mb-2"
               style="font-family:var(--font-display)">ADGANGSKODE</label>
        <input bind:value={password} type="password" placeholder="••••••••"
               class="neon-input" onkeydown={(e) => e.key === 'Enter' && handleLogin()} />
      </div>

      {#if error}
        <p class="text-[var(--color-neon-pink)] text-sm text-center">{error}</p>
      {/if}

      <button onclick={handleLogin} disabled={loading} class="btn-pink w-full" style="width:100%">
        {loading ? 'LOGGER IND...' : 'LOG IND'}
      </button>
    </div>

    <p class="text-center text-[var(--color-dim)] text-sm mt-6" style="font-family:var(--font-body)">
      Ingen konto?
      <a href="/register" class="text-[var(--color-neon-cyan)] hover:glow-cyan transition-all ml-1">
        Opret bruger
      </a>
    </p>

  </div>
</div>
