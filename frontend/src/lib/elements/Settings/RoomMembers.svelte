<script lang="ts">
	import {
		Crown,
		Shield,
		Ban,
		Timer,
		UserX,
		UserMinus,
		Check,
		X,
	} from "lucide-svelte";
	import { get } from "svelte/store";
	import {
		members,
		memberFlags,
		isHost,
		myId,
		HOST_NICK,
		setMemberFlag,
		kickMember,
		renameMember,
	} from "$lib/stores/room";
	import { nameA, nameB, slot1, slot2 } from "$lib/stores/players";

	function assignSlot(slot: 1 | 2, id: string, nick: string) {
		if (slot === 1) {
			if (get(slot2) === id) {
				nameB.set("");
				slot2.set("");
			}
			nameA.set(nick);
			slot1.set(id);
		} else {
			if (get(slot1) === id) {
				nameA.set("");
				slot1.set("");
			}
			nameB.set(nick);
			slot2.set(id);
		}
	}

	function removeFromPlayers(id: string) {
		if (get(slot1) === id) {
			nameA.set("");
			slot1.set("");
		}
		if (get(slot2) === id) {
			nameB.set("");
			slot2.set("");
		}
	}

	let selected = $state<string | null>(null);
	let editNick = $state("");
	let confirm = $state<"host" | "kick" | null>(null);

	const me = myId();

	const sel = $derived($members.find((m) => m.id === selected) ?? null);
	const flags = $derived(selected ? ($memberFlags[selected] ?? {}) : {});
	const roleOf = (id: string, nick: string) =>
		$memberFlags[id]?.role ?? (nick === HOST_NICK ? "host" : "guest");

	function pick(id: string, nick: string) {
		selected = id;
		editNick = nick;
		confirm = null;
	}

	function makeHost(id: string) {
		setMemberFlag(id, { role: "host" });
		setMemberFlag(me, { role: "guest" });
		confirm = null;
	}
</script>

<p class="hint">
	{#if $isHost}
		Нажми на участника, чтобы управлять им.
	{:else}
		Список участников комнаты.
	{/if}
</p>

<ul class="list">
	{#each $members as m (m.id)}
		{@const role = roleOf(m.id, m.nick)}
		{@const f = $memberFlags[m.id] ?? {}}
		<li>
			<button
				class="row"
				class:active={selected === m.id}
				disabled={!$isHost}
				onclick={() => pick(m.id, m.nick)}
			>
				<span class="nick">{m.nick}{m.id === me ? " (вы)" : ""}</span>
				<span class="badges">
					{#if role === "host"}<Crown size={15} />{/if}
					{#if role === "rights"}<Shield size={15} />{/if}
					{#if f.canEditTimer}<Timer size={15} />{/if}
					{#if f.bannedReactions}<Ban size={15} />{/if}
				</span>
			</button>
		</li>
	{/each}
</ul>

{#if $isHost && sel}
	{@const role = roleOf(sel.id, sel.nick)}
	<div class="panel">
		<div class="rename">
			<input bind:value={editNick} maxlength="20" placeholder="Ник" />
			<button
				class="btn"
				disabled={!editNick.trim() || editNick === sel.nick}
				onclick={() => renameMember(sel.id, editNick.trim())}
			>
				<Check size={16} />Переименовать
			</button>
		</div>

		<div class="grid">
			<button
				class="btn"
				class:on={$slot1 === sel.id}
				onclick={() => assignSlot(1, sel.id, sel.nick)}>Игрок 1</button
			>
			<button
				class="btn"
				class:on={$slot2 === sel.id}
				onclick={() => assignSlot(2, sel.id, sel.nick)}>Игрок 2</button
			>
			{#if $slot1 === sel.id || $slot2 === sel.id}
				<button class="btn" onclick={() => removeFromPlayers(sel.id)}>
					<UserMinus size={16} />Убрать из игроков
				</button>
			{/if}
		</div>

		{#if sel.id !== me}
			<div class="grid">
				<button
					class="btn"
					class:on={flags.canEditTimer}
					onclick={() =>
						setMemberFlag(sel.id, {
							canEditTimer: !flags.canEditTimer,
						})}
				>
					<Timer size={16} />Править таймер
				</button>
				<button
					class="btn"
					class:on={role === "rights"}
					onclick={() =>
						setMemberFlag(sel.id, {
							role: role === "rights" ? "guest" : "rights",
						})}
				>
					<Shield size={16} />Права хоста
				</button>
				<button
					class="btn"
					class:on={flags.bannedReactions}
					onclick={() =>
						setMemberFlag(sel.id, {
							bannedReactions: !flags.bannedReactions,
						})}
				>
					<Ban size={16} />Бан реакций
				</button>
			</div>

			{#if confirm}
				<div class="confirm">
					<span
						>{confirm === "kick"
							? "Кикнуть участника?"
							: "Передать ему статус хоста?"}</span
					>
					<button
						class="btn primary"
						onclick={() =>
							confirm === "kick"
								? kickMember(sel.id)
								: makeHost(sel.id)}
					>
						<Check size={16} />Да
					</button>
					<button class="btn" onclick={() => (confirm = null)}>
						<X size={16} />Нет
					</button>
				</div>
			{:else}
				<div class="grid">
					<button
						class="btn"
						onclick={() => (confirm = "host")}
					>
						<Crown size={16} />Сделать хостом
					</button>
					<button
						class="btn danger"
						onclick={() => (confirm = "kick")}
					>
						<UserX size={16} />Кикнуть
					</button>
				</div>
			{/if}
		{/if}
	</div>
{/if}

<style>
	.hint {
		margin: 0;
		color: var(--fg-muted);
	}

	.list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
		width: 100%;
		max-width: 640px;
	}

	.row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.6rem;
		width: 100%;
		padding: 0.6rem 0.9rem;
		font-family: inherit;
		font-size: 1rem;
		border-radius: var(--radius-lg);
		border: 2px solid var(--accent);
		background: transparent;
		color: var(--fg);
		cursor: pointer;
		transition: background 0.15s ease;
	}

	.row:disabled {
		cursor: default;
	}

	.row.active {
		background: var(--accent);
		color: var(--bg);
	}

	.nick {
		font-weight: 700;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.badges {
		display: flex;
		gap: 0.3rem;
		flex-shrink: 0;
		color: var(--accent-light);
	}

	.row.active .badges {
		color: var(--bg);
	}

	.panel {
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
		width: 100%;
		max-width: 640px;
		margin-top: 0.4rem;
	}

	.rename {
		display: flex;
		gap: 0.4rem;
	}

	.rename input {
		flex: 1;
		font-family: inherit;
		font-size: 1rem;
		padding: 0.5rem 0.8rem;
		border-radius: var(--radius-lg);
		border: 2px solid var(--input-border);
		background: var(--input-bg);
		color: var(--input-fg);
	}

	.grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.4rem;
	}

	.confirm {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		flex-wrap: wrap;
		padding: 0.6rem;
		border-radius: var(--radius-lg);
		border: 2px solid var(--accent);
	}

	.confirm span {
		flex: 1;
		font-weight: 700;
	}

	.btn {
		font-family: inherit;
		cursor: pointer;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.4rem;
		font-size: 0.95rem;
		font-weight: 700;
		border-radius: var(--radius-lg);
		padding: 0.55rem 0.9rem;
		border: 2px solid var(--accent);
		background: transparent;
		color: var(--accent-light);
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease;
	}

	.btn:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 4px 4px 0 var(--accent-dark);
	}

	.btn:disabled {
		opacity: 0.5;
		cursor: default;
	}

	.btn.primary {
		background: var(--accent);
		color: var(--bg);
	}

	.btn.on {
		background: var(--accent);
		color: var(--bg);
	}

	.btn.danger {
		border-color: #ff6b6b;
		color: #ff6b6b;
	}

	@media (prefers-reduced-motion: reduce) {
		.btn {
			transition: none;
		}
	}
</style>
