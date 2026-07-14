// SPDX-License-Identifier: AGPL-3.0-or-later

import * as Modal from '@app/features/app/components/dialogs/Modal';
import {Button} from '@app/features/ui/button/Button';
import * as ModalCommands from '@app/features/ui/commands/ModalCommands';
import {modal} from '@app/features/ui/commands/ModalCommands';
import {msg} from '@lingui/core/macro';
import {Trans, useLingui} from '@lingui/react/macro';
import {observer} from 'mobx-react-lite';
import {createElement} from 'react';

const ACCOUNT_SUSPENDED_DESCRIPTOR = msg({
	message: 'Account suspended',
	comment: 'Title for login modal shown when an account is suspended.',
});

const BANNED_UNTIL_DESCRIPTOR = msg({
	message: 'Banned until {date}',
	comment: 'Login suspension modal line showing when a temporary ban ends.',
});

const CLOSE_DESCRIPTOR = msg({
	message: 'Close',
	comment: 'Generic close button label in modal footer.',
});

export interface LoginBanModalProps {
	publicReason?: string | null;
	bannedUntil?: string | null;
}

export const LoginBanModal = observer(function LoginBanModal({publicReason, bannedUntil}: LoginBanModalProps) {
	const {i18n} = useLingui();
	const formattedBannedUntil = formatBanEndDate(bannedUntil, i18n.locale);

	return (
		<Modal.Root size="small" centered data-flx="auth.login-ban-modal.modal-root">
			<Modal.Header title={i18n._(ACCOUNT_SUSPENDED_DESCRIPTOR)} data-flx="auth.login-ban-modal.modal-header" />
			<Modal.Content data-flx="auth.login-ban-modal.modal-content">
				<Modal.ContentLayout data-flx="auth.login-ban-modal.modal-content-layout">
					{publicReason ? (
						<Modal.Description data-flx="auth.login-ban-modal.modal-description.reason">{publicReason}</Modal.Description>
					) : (
						<Modal.Description data-flx="auth.login-ban-modal.modal-description.default">
							<Trans>Your account is currently suspended.</Trans>
						</Modal.Description>
					)}
					{formattedBannedUntil ? (
						<Modal.Description data-flx="auth.login-ban-modal.modal-description.banned-until">
							{i18n._(BANNED_UNTIL_DESCRIPTOR, {date: formattedBannedUntil})}
						</Modal.Description>
					) : null}
				</Modal.ContentLayout>
			</Modal.Content>
			<Modal.Footer data-flx="auth.login-ban-modal.modal-footer">
				<Button onClick={ModalCommands.pop} variant="primary" data-flx="auth.login-ban-modal.button.close">
					{i18n._(CLOSE_DESCRIPTOR)}
				</Button>
			</Modal.Footer>
		</Modal.Root>
	);
});

export function showLoginBanModal({publicReason, bannedUntil}: LoginBanModalProps): void {
	ModalCommands.push(modal(() => createElement(LoginBanModal, {publicReason, bannedUntil})));
}

function formatBanEndDate(value: string | null | undefined, locale: string | null | undefined): string | null {
	if (!value) {
		return null;
	}
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) {
		return null;
	}
	return new Intl.DateTimeFormat(locale ?? undefined, {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	}).format(date);
}
