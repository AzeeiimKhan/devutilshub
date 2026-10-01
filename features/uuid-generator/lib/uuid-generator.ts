export const UUID_QUANTITIES = [1, 10, 100] as const;

export type UuidQuantity = (typeof UUID_QUANTITIES)[number];

export type UuidGenerationResult =
  { ok: true; values: string[] } | { ok: false; error: string };

function browserRandomUuid() {
  const randomUuid = globalThis.crypto?.randomUUID;
  return randomUuid ? randomUuid.call(globalThis.crypto) : null;
}

export function generateUuids(
  quantity: UuidQuantity,
  createUuid: () => string | null = browserRandomUuid,
): UuidGenerationResult {
  if (!UUID_QUANTITIES.includes(quantity)) {
    return { ok: false, error: "Choose a supported UUID quantity." };
  }

  const values: string[] = [];

  for (let index = 0; index < quantity; index += 1) {
    const value = createUuid();

    if (!value) {
      return {
        ok: false,
        error:
          "UUID generation is unavailable in this browser. Try a current browser over HTTPS or localhost.",
      };
    }

    values.push(value);
  }

  return { ok: true, values };
}
