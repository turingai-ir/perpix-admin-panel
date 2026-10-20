import { apiClient } from "@/services/api/client";

export class SecurityActionError extends Error {
  constructor(
    public readonly type:
      | "unauthorized"
      | "forbidden"
      | "not_found"
      | "validation"
      | "network"
      | "server",
    message?: string,
  ) {
    super(message || type);
    this.name = "SecurityActionError";
  }
}

function handleFetchError(error: unknown): never {
  if (error instanceof SecurityActionError) throw error;
  if (error instanceof Error) {
    throw new SecurityActionError("network", error.message);
  }
  throw new SecurityActionError("server", "یک خطای غیرمنتظره رخ داده است.");
}

export async function revokeUserSession(
  userUuid: string,
  sessionUuid: string,
): Promise<void> {
  try {
    const res = await apiClient.DELETE(
      "/api/admin/v1/auth/users/{user_uuid}/sessions/{session_uuid}",
      {
        params: {
          path: {
            user_uuid: userUuid,
            session_uuid: sessionUuid,
          },
        },
      },
    );
    if (res.error) {
      throw new SecurityActionError("server");
    }
  } catch (error) {
    return handleFetchError(error);
  }
}

export async function revokeApiToken(tokenUuid: string): Promise<void> {
  try {
    const res = await apiClient.DELETE(
      "/api/admin/v1/auth/api-tokens/{token_uuid}",
      {
        params: {
          path: {
            token_uuid: tokenUuid,
          },
        },
      },
    );
    if (res.error) {
      throw new SecurityActionError("server");
    }
  } catch (error) {
    return handleFetchError(error);
  }
}
