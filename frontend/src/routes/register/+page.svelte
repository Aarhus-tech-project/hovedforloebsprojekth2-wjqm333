<script lang="ts">
  import { apiFetch, setUser } from '$lib/api';
  import { goto } from '$app/navigation';

  let username = $state('');
  let email    = $state('');
  let password = $state('');
  let error    = $state('');
  let loading  = $state(false);

  async function handleRegister() {
    error = '';
    if (!username || !email || !password) { error = 'Udfyld alle felter.'; return; }
    loading = true;
    try {
      const data = await apiFetch('/user/register', {
        method: 'POST',
        body: JSON.stringify({ username, email, password }),
      }) as { id: number; username: string };
      setUser({ id: data.id, username: data.username });
      goto('/');
    } catch (e: unknown) {
      error = e instanceof Error ? e.message : 'Registrering fejlede';
    } finally {
      loading = false;
    }
  }
</script>

<div class="min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4">
  <div class="w-full max-w-sm">

    <div class="text-center mb-10">
      <div class="text-[var(--color-neon-cyan)] text-3xl mb-3">◈</div>
      <h1 class="text-2xl font-black tracking-widest glow-cyan"
          style="font-family:var(--font-display); color:var(--color-neon-cyan)">
        OPRET BRUGER
      </h1>
      <p class="text-[var(--color-dim)] text-xs mt-2 tracking-widest" style="font-family:var(--font-body)">
        Ny konto
      </p>
    </div>

    <div class="neon-card p-7 space-y-5">
      <div>
        <label class="block text-xs tracking-widest text-[var(--color-neon-cyan)]/60 mb-2"
               style="font-family:var(--font-display)">BRUGERNAVN</label>
        <input bind:value={username} type="text" placeholder="dit_brugernavn" class="neon-input" />
      </div>

      <div>
        <label class="block text-xs tracking-widest text-[var(--color-neon-cyan)]/60 mb-2"
               style="font-family:var(--font-display)">EMAIL</label>
        <input bind:value={email} type="email" placeholder="din@email.dk" class="neon-input" />
      </div>

      <div>
        <label class="block text-xs tracking-widest text-[var(--color-neon-cyan)]/60 mb-2"
               style="font-family:var(--font-display)">ADGANGSKODE</label>
        <input bind:value={password} type="password" placeholder="••••••••"
               class="neon-input" onkeydown={(e) => e.key === 'Enter' && handleRegister()} />
      </div>

      {#if error}
        <p class="text-[var(--color-neon-pink)] text-sm text-center">{error}</p>
      {/if}

      <button onclick={handleRegister} disabled={loading} class="btn-cyan" style="width:100%">
        {loading ? 'OPRETTER...' : 'OPRET KONTO'}
      </button>
    </div>

    <p class="text-center text-[var(--color-dim)] text-sm mt-6" style="font-family:var(--font-body)">
      Har du allerede en konto?
      <a href="/login" class="text-[var(--color-neon-pink)] hover:glow-pink transition-all ml-1">
        Log ind
      </a>
    </p>

  </div>
</div>
