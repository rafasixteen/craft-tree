'use client';

import { useState, useEffect } from 'react';
import { ResourceType, DeleteTarget } from '@/components/confirmation-dialog';
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface ResourceMetaInfo
{
	icon: string;
	color: string;
	description: (name: string) => string;
	warningThreshold: number;
}

const RESOURCE_META: Record<ResourceType, ResourceMetaInfo> = {
	inventory: {
		icon: '▦',
		color: '#e8643c',
		description: (name) =>
			`"${name}" is a top-level inventory. Deleting it will cascade through all its items, producers, tags, and production graphs.`,
		warningThreshold: 1,
	},
	item: {
		icon: '◈',
		color: '#d4a843',
		description: (name) => `"${name}" may be used as an input or output in producer pipelines.`,
		warningThreshold: 1,
	},
	producer: {
		icon: '⬡',
		color: '#5b9cf6',
		description: (name) => `"${name}" has inputs and outputs linked to items in the inventory.`,
		warningThreshold: 1,
	},
	tag: {
		icon: '⬙',
		color: '#8b6cf7',
		description: (name) => `Tag "${name}" may be attached to items and producers.`,
		warningThreshold: 1,
	},
	production_graph: {
		icon: '◎',
		color: '#3cb87a',
		description: (name) => `Production graph "${name}" stores complex graph data (jsonb) tied to this inventory.`,
		warningThreshold: 1,
	},
};

interface DeleteConfirmationDialogProps
{
	trigger: React.ReactNode;
	target: DeleteTarget | null;
	onConfirm: (target: DeleteTarget) => Promise<void>;
	onCancel?: () => void;
}

export function DeleteConfirmationDialog({ trigger, target, onConfirm, onCancel }: DeleteConfirmationDialogProps)
{
	const [confirmText, setConfirmText] = useState<string>('');
	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() =>
	{
		if (!target)
		{
			setConfirmText('');
			setLoading(false);
		}
	}, [target]);

	const meta = target ? RESOURCE_META[target.resourceType] : null;
	const hasCritical = target?.references.some((r) => r.critical) ?? false;
	const totalRefs = target?.references.reduce((s, r) => s + r.count, 0) ?? 0;
	const needsTyping = meta ? hasCritical || totalRefs >= meta.warningThreshold : false;
	const canConfirm = !needsTyping || confirmText.trim() === target?.resourceName;

	async function handleConfirm()
	{
		if (!canConfirm || !target)
		{
			return;
		}

		setLoading(true);

		try
		{
			await onConfirm(target);
			setOpen(false);
		}
		finally
		{
			setLoading(false);
		}
	}

	const [open, setOpen] = useState(false);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{trigger}</DialogTrigger>
			<DialogContent
				className="p-0 gap-0 overflow-hidden"
				style={{
					background: '#0f1117',
					border: `1px solid ${meta?.color ?? '#ffffff20'}44`,
					borderTop: `3px solid ${meta?.color ?? '#ffffff20'}`,
					borderRadius: '4px',
					boxShadow: `0 0 60px ${meta?.color ?? '#000'}22, 0 24px 48px rgba(0,0,0,0.6)`,
					maxWidth: '520px',
					fontFamily: "'IBM Plex Mono', 'Fira Code', monospace",
				}}
			>
				{/* visually hidden title for a11y — shadcn requires it */}
				<DialogTitle className="sr-only">
					Delete {target?.resourceType} {target?.resourceName}
				</DialogTitle>

				{/* Header */}
				<div
					style={{
						padding: '20px 24px 16px',
						borderBottom: '1px solid #ffffff10',
						display: 'flex',
						alignItems: 'flex-start',
						gap: '14px',
					}}
				>
					<div
						style={{ fontSize: '22px', lineHeight: 1, color: meta?.color, marginTop: '2px', flexShrink: 0 }}
					>
						{meta?.icon}
					</div>
					<div style={{ flex: 1 }}>
						<div
							style={{
								fontSize: '11px',
								letterSpacing: '0.12em',
								textTransform: 'uppercase',
								color: '#ffffff44',
								marginBottom: '6px',
							}}
						>
							Delete {target?.resourceType}
						</div>
						<div
							style={{
								fontSize: '16px',
								fontWeight: 600,
								color: '#f0f0f0',
								letterSpacing: '-0.02em',
								fontFamily: "'IBM Plex Sans', sans-serif",
							}}
						>
							{target?.resourceName}
						</div>
					</div>
				</div>

				{/* Description */}
				<div
					style={{
						padding: '16px 24px',
						fontSize: '13px',
						color: '#a0a0a0',
						lineHeight: 1.6,
						borderBottom: (target?.references.length ?? 0) > 0 ? '1px solid #ffffff08' : 'none',
					}}
				>
					{target && meta?.description(target.resourceName)}
				</div>

				{/* References */}
				{(target?.references.length ?? 0) > 0 && (
					<div style={{ padding: '14px 24px 4px' }}>
						<div
							style={{
								fontSize: '10px',
								letterSpacing: '0.1em',
								textTransform: 'uppercase',
								color: '#ffffff30',
								marginBottom: '10px',
							}}
						>
							Affected references
						</div>
						<div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
							{target?.references.map((ref, i) => (
								<div
									key={i}
									style={{
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'space-between',
										padding: '8px 12px',
										background: ref.critical ? '#e8643c0c' : '#ffffff05',
										border: ref.critical ? '1px solid #e8643c30' : '1px solid #ffffff08',
										borderRadius: '3px',
									}}
								>
									<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
										{ref.critical && <span style={{ color: '#e8643c', fontSize: '11px' }}>⚠</span>}
										<span style={{ fontSize: '12px', color: ref.critical ? '#e8a07a' : '#888' }}>
											{ref.label}
										</span>
									</div>
									<span
										style={{
											fontSize: '12px',
											fontWeight: 600,
											color: ref.critical ? '#e8643c' : '#ffffff60',
											background: ref.critical ? '#e8643c18' : '#ffffff0a',
											padding: '2px 8px',
											borderRadius: '2px',
											letterSpacing: '0.04em',
										}}
									>
										{ref.count}
									</span>
								</div>
							))}
						</div>
					</div>
				)}

				{/* Typing confirmation */}
				{needsTyping && (
					<div style={{ padding: '16px 24px 4px' }}>
						<label
							htmlFor="confirm-input"
							style={{
								display: 'block',
								fontSize: '11px',
								color: '#ffffff40',
								marginBottom: '8px',
								letterSpacing: '0.06em',
							}}
						>
							Type&nbsp;
							<span style={{ color: meta?.color, fontWeight: 700, letterSpacing: '0.02em' }}>
								{target?.resourceName}
							</span>
							&nbsp;to confirm
						</label>
						<input
							id="confirm-input"
							type="text"
							autoFocus
							value={confirmText}
							onChange={(e) => setConfirmText(e.target.value)}
							onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
							placeholder={target?.resourceName}
							style={{
								width: '100%',
								background: '#ffffff06',
								border: `1px solid ${confirmText === target?.resourceName ? (meta?.color ?? '') + '88' : '#ffffff14'}`,
								borderRadius: '3px',
								padding: '9px 12px',
								fontSize: '13px',
								color: '#f0f0f0',
								outline: 'none',
								fontFamily: 'inherit',
								transition: 'border-color 0.15s',
								boxSizing: 'border-box',
							}}
						/>
					</div>
				)}

				{/* Actions */}
				<div style={{ padding: '20px 24px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
					<DialogClose asChild>
						<button
							onClick={onCancel}
							disabled={loading}
							style={{
								padding: '8px 18px',
								background: 'transparent',
								border: '1px solid #ffffff18',
								borderRadius: '3px',
								color: '#888',
								fontSize: '12px',
								letterSpacing: '0.06em',
								cursor: 'pointer',
								fontFamily: 'inherit',
							}}
							onMouseEnter={(e) =>
							{
								e.currentTarget.style.borderColor = '#ffffff30';
								e.currentTarget.style.color = '#ccc';
							}}
							onMouseLeave={(e) =>
							{
								e.currentTarget.style.borderColor = '#ffffff18';
								e.currentTarget.style.color = '#888';
							}}
						>
							Cancel
						</button>
					</DialogClose>
					<button
						onClick={handleConfirm}
						disabled={!canConfirm || loading}
						style={{
							padding: '8px 20px',
							background: canConfirm ? meta?.color : '#ffffff0a',
							border: `1px solid ${canConfirm ? meta?.color : 'transparent'}`,
							borderRadius: '3px',
							color: canConfirm ? '#fff' : '#ffffff30',
							fontSize: '12px',
							letterSpacing: '0.06em',
							cursor: canConfirm ? 'pointer' : 'not-allowed',
							fontFamily: 'inherit',
							fontWeight: 600,
							display: 'flex',
							alignItems: 'center',
							gap: '7px',
						}}
					>
						{loading ? (
							<>
								<span
									style={{
										display: 'inline-block',
										width: '10px',
										height: '10px',
										border: '2px solid #fff6',
										borderTopColor: '#fff',
										borderRadius: '50%',
										animation: 'spin 0.7s linear infinite',
									}}
								/>
								Deleting...
							</>
						) : (
							<>Delete {target?.resourceType}</>
						)}
					</button>
				</div>
				<style>{`
          @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600&family=IBM+Plex+Sans:wght@400;600&display=swap');
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
			</DialogContent>
		</Dialog>
	);
}
