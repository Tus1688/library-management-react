import { ErrorResponse } from "@/types/api";
import { GetBookResponse } from "@/types/book";

export async function ReqPublicBook(data: {
  limit: number;
  last_id?: number;
  search?: string;
}): Promise<GetBookResponse[] | undefined> {
  const url = new URL("/api/v1/collections/book", window.location.origin);
  const { limit, last_id, search } = data;

  url.searchParams.append("limit", limit.toString());

  if (last_id !== undefined) {
    url.searchParams.append("last_id", last_id.toString());
  }

  if (search) {
    url.searchParams.append("search", search);
  }

  return makeRequestWithRetrySilent404<GetBookResponse[]>(() =>
    fetch(url.toString(), { method: "GET" })
  );
}

async function ReqGetRefreshToken(): Promise<boolean | undefined> {
  const makeRequest = async () => {
    return await fetch("/api/v1/auth/refresh", {
      method: "POST",
    });
  }

  const response = await makeRequest();

  if (!response.ok) {
    localStorage.removeItem("isLoggedIn")
    return false;
  }

  return true;
}

export async function makeRequestWithRetryReturnValue<Y>(requestFunction: () => Promise<Response>): Promise<Y | undefined> {
  try {
    let response = await requestFunction();

    if (response.status === 401) {
      const refreshTokenResult = await ReqGetRefreshToken();

      if (refreshTokenResult === true) {
        response = await requestFunction();
      } else {
        const err: ErrorResponse = {
          status: 401,
          error: "Session expired. Please log in again."
        }
        return Promise.reject(err);
      }
    }
    if (!response.ok) {
      return Promise.reject(await response.json())
    }

    return await response.json();
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function makeRequestWithRetryReturnBoolean(requestFunction: () => Promise<Response>): Promise<boolean | undefined> {
  try {
    let response = await requestFunction();

    if (response.status === 401) {
      const refreshTokenResult = await ReqGetRefreshToken();

      if (refreshTokenResult === true) {
        response = await requestFunction();
      } else {
        const err: ErrorResponse = {
          status: 401,
          error: "Session expired. Please log in again."
        }
        return Promise.reject(err);
      }
    }
    if (!response.ok) {
      return Promise.reject(await response.json())
    }

    return true;
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function makeRequestWithRetrySilent404<T>(requestFunction: () => Promise<Response>): Promise<T | undefined> {
  try {
    let response = await requestFunction();

    if (response.status === 401) {
      const refreshTokenResult = await ReqGetRefreshToken();

      if (refreshTokenResult === true) {
        response = await requestFunction();
      } else {
        const err: ErrorResponse = {
          status: 401,
          error: "Session expired. Please log in again."
        }
        return Promise.reject(err);
      }
    }

    if (!response.ok) {
      if (response.status === 404) {
        return [] as T;
      }
      return Promise.reject(await response.json());
    }

    return await response.json();
  } catch (error) {
    return Promise.reject(error);
  }
}