/**
 * Example to refresh tokens using https://github.com/auth0/node-jsonwebtoken
 * It was requested to be introduced at as part of the jsonwebtoken library,
 * since we feel it does not add too much value but it will add code to mantain
 * we won't include it.
 *
 * I create this gist just to help those who want to auto-refresh JWTs.
 */

import jwt, { SignOptions, VerifyOptions, JwtPayload } from 'jsonwebtoken'

class TokenGenerator {
  private secretOrPrivateKey: string
  private secretOrPublicKey: string
  private options: SignOptions

  constructor(
    secretOrPrivateKey: string,
    secretOrPublicKey: string,
    options: SignOptions,
  ) {
    this.secretOrPrivateKey = secretOrPrivateKey
    this.secretOrPublicKey = secretOrPublicKey
    this.options = options // algorithm + keyid + noTimestamp + expiresIn + notBefore
  }

  sign(payload: string | object | Buffer, signOptions?: SignOptions): string {
    const jwtSignOptions = { ...signOptions, ...this.options }
    return jwt.sign(payload, this.secretOrPrivateKey, jwtSignOptions)
  }

  refresh(
    token: string,
    refreshOptions: { verify: VerifyOptions; jwtid?: string },
  ): string {
    const payload = jwt.verify(
      token,
      this.secretOrPublicKey,
      refreshOptions.verify,
    ) as JwtPayload
    delete payload.iat
    delete payload.exp
    delete payload.nbf
    delete payload.jti // We are generating a new token, if you are using jwtid during signing, pass it in refreshOptions
    const jwtSignOptions = { ...this.options, jwtid: refreshOptions.jwtid }
    // The first signing converted all needed options into claims, they are already in the payload
    return jwt.sign(payload, this.secretOrPrivateKey, jwtSignOptions)
  }
}

export default TokenGenerator
