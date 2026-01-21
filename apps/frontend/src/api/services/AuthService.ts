/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AuthService {
    /**
     * Sets the CSRF cookie.
     * @returns any
     * @throws ApiError
     */
    public static authCsrf(): CancelablePromise<{
        ok?: boolean;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/auth/csrf/',
        });
    }
    /**
     * @param data
     * @returns any
     * @throws ApiError
     */
    public static authLogin(
        data: {
            email: string;
            password: string;
            remember_me?: boolean;
        },
    ): CancelablePromise<{
        ok?: boolean;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/login/',
            body: data,
        });
    }
    /**
     * @returns any
     * @throws ApiError
     */
    public static authLogoutAll(): CancelablePromise<{
        ok?: boolean;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/logout-all/',
        });
    }
    /**
     * @returns any
     * @throws ApiError
     */
    public static authLogout(): CancelablePromise<{
        ok?: boolean;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/logout/',
        });
    }
    /**
     * @returns any
     * @throws ApiError
     */
    public static authMe(): CancelablePromise<{
        authenticated?: boolean;
        user?: {
            email?: string;
            organization?: {
                id?: number;
                name?: string;
                plan?: string;
            };
        };
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/auth/me/',
        });
    }
}
