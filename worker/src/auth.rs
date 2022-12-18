use argon2::{
    password_hash::{rand_core::OsRng, Result, SaltString},
    Argon2, PasswordHash, PasswordHasher, PasswordVerifier,
};
use chrono::{Duration, NaiveDateTime, Utc};
use hmac::{Hmac, Mac};
use serde::{Deserialize, Serialize};
use sha2::Sha256;

#[derive(Deserialize)]
pub(crate) struct PasswordInput {
    password: String,
}
impl PasswordInput {
    pub(crate) fn to_password(&self) -> Result<Password> {
        let salt = SaltString::generate(&mut OsRng);
        let argon2 = Argon2::default();
        let password_hash = argon2
            .hash_password(self.password.as_bytes(), &salt)?
            .to_string();
        Ok(Password::new(password_hash))
    }

    pub(crate) fn get(&self) -> &str {
        self.password.as_ref()
    }
}

#[derive(Serialize)]
pub(crate) struct Password {
    hashed: String,
}
impl Password {
    pub(crate) fn new(hashed_password: String) -> Self {
        Self {
            hashed: hashed_password,
        }
    }
    pub(crate) fn check(&self, password: &str) -> Result<bool> {
        let parsed_hash = PasswordHash::new(&self.hashed)?;

        Ok(Argon2::default()
            .verify_password(password.as_bytes(), &parsed_hash)
            .is_ok())
    }
}

type StdResult<T> = std::result::Result<T, Box<dyn std::error::Error>>;

#[derive(Serialize, Deserialize)]
pub(crate) struct Claims {
    exp: i64,
    admin: bool,
}

impl Claims {
    pub(crate) fn admin() -> Self {
        let date = Utc::now().naive_local() + Duration::days(1);
        Self {
            exp: date.timestamp_millis(),
            admin: true,
        }
    }

    pub(crate) fn token(&self, secret: &str) -> StdResult<String> {
        use jwt::SignWithKey;

        let key = Hmac::<Sha256>::new_from_slice(secret.as_bytes())?;
        Ok(Claims::admin().sign_with_key(&key)?)
    }

    pub(crate) fn verify(token: &str, secret: &str) -> StdResult<Claims> {
        use jwt::VerifyWithKey;

        let key = Hmac::<Sha256>::new_from_slice(secret.as_bytes())?;
        let claims: Claims = token.verify_with_key(&key)?;

        if NaiveDateTime::from_timestamp_millis(claims.exp) <= Some(Utc::now().naive_local()) {
            Ok(claims)
        } else {
            Err("Expired".into())
        }
    }

    pub(crate) fn get_admin(&self) -> bool {
        self.admin
    }
}
