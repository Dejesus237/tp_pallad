/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class LicenseCheckService {
    /**
     * Vérifie les dates d'expiration des licenses
     * @param data
     * @returns any
     * @throws ApiError
     */
    public static licensesSubmitCreate(
        data: {
            ref: string;
        },
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/licenses/submit/',
            body: data,
        });
    }
}
