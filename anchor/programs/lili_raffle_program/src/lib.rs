use anchor_lang::prelude::*;

pub const RAFFLE_SEED: &[u8] = b"raffle";

#[program]
pub mod lili_raffle_program {
    use super::*;

    pub fn initialize(
        ctx: Context<Initialize>,
        params: RaffleParams,
    ) -> Result<()> {
        let raffle = &mut ctx.accounts.raffle;
        raffle.authority = ctx.accounts.authority.key();
        raffle.price_lamports = params.price_lamports;
        raffle.max_tickets = params.max_tickets;
        raffle.end_timestamp = params.end_timestamp;
        raffle.bump = *ctx.bumps.get("raffle").unwrap();
        Ok(())
    }

    pub fn buy_ticket(ctx: Context<BuyTicket>) -> Result<()> {
        let raffle = &mut ctx.accounts.raffle;
        require!(Clock::get()?.unix_timestamp < raffle.end_timestamp, RaffleError::RaffleEnded);
        raffle.tickets_sold += 1;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = authority,
        seeds = [RAFFLE_SEED, authority.key().as_ref()],
        bump,
        space = 8 + Raffle::INITIAL_SIZE
    )]
    pub raffle: Account<'info, Raffle>;
    #[account(mut)]
    pub authority: Signer<'info>;
    pub system_program: Program<'info, System>;
}

#[derive(Accounts)]
pub struct BuyTicket<'info> {
    #[account(mut, has_one = authority)]
    pub raffle: Account<'info, Raffle>;
    pub authority: Signer<'info>;
}

#[account]
pub struct Raffle {
    pub authority: Pubkey;
    pub price_lamports: u64;
    pub max_tickets: u32;
    pub tickets_sold: u32;
    pub end_timestamp: i64;
    pub bump: u8;
}

impl Raffle {
    pub const INITIAL_SIZE: usize = 32 + 8 + 4 + 4 + 8 + 1;
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct RaffleParams {
    pub price_lamports: u64;
    pub max_tickets: u32;
    pub end_timestamp: i64;
}

#[error_code]
pub enum RaffleError {
    #[msg("Raffle already ended")] 
    RaffleEnded,
}
