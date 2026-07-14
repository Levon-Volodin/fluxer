// SPDX-License-Identifier: AGPL-3.0-or-later

import {APIErrorCodes} from '@fluxer/constants/src/ApiErrorCodes';
import {ForbiddenError} from '@fluxer/errors/src/domains/core/ForbiddenError';

export class AccountTemporarilySuspendedError extends ForbiddenError {
	constructor(data?: {public_reason?: string | null; banned_until?: string | null}) {
		super({code: APIErrorCodes.ACCOUNT_SUSPENDED_TEMPORARILY, data});
	}
}
