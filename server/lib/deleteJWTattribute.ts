export default function deleteJWTattribute(payload: JsonObject): JsonObject {
  delete payload.iat
  delete payload.exp
  delete payload.nbf
  delete payload.jti
  delete payload.jwtid
  return payload
}
