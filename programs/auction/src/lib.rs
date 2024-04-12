use anchor_lang::prelude::*;
use std::fmt::Debug;

declare_id!("8fwi3RtHHKogVd2wwqttrrMSazL9vnkttUikD4CW9y2J");

#[error_code]
pub enum NameError {
    #[msg("The name string is too long")]
    StringTooLong,
    #[msg("The name string is empty")]
    EmptyString,
}

#[error_code]
pub enum BideError {
    #[msg("The given price was too low")]
    PriceTooLow,
    #[msg("The bidder is already the top one")]
    SameBidder,
    #[msg("The auction ended, you can bid now")]
    AuctionEnded,
}

#[program]
pub mod auction {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, auction_info: AuctionInfo) -> Result<()> {
        msg!("In init fn");
        require!(auction_info.name.len() <= 50, NameError::StringTooLong);
        require!(!auction_info.name.is_empty(), NameError::EmptyString);
        let auction = &mut ctx.accounts.new_auction;
        auction.auction_info = auction_info.clone();
        auction.bump = ctx.bumps.new_auction;
        auction.receiver = *ctx.accounts.user.key;
        msg!("auction is now = {:?}", **auction);
        Ok(())
    }

    pub fn bide(ctx: Context<Bide>, bide_info: BideInfo) -> Result<()> {
        msg!("In bide fn");
        let auction = &mut ctx.accounts.auction;
        require!(
            bide_info.price > auction.bide_info.price,
            BideError::PriceTooLow
        );
        require!(
            bide_info.bidder != auction.bide_info.bidder,
            BideError::SameBidder
        );
        require!(!auction.end_state, BideError::AuctionEnded);
        auction.bide_info = bide_info;
        msg!("auction is now = {:?}", **auction);
        Ok(())
    }

    pub fn end_auction(ctx: Context<EndAuction>) -> Result<()> {
        msg!("In end auction fn");
        let auction = &mut ctx.accounts.auction;
        auction.end_state = true;
        Ok(())
    }

    pub fn close_account(_ctx: Context<CloseAccount>) -> Result<()> {
        //need to check that the closer can actually do that ???
        msg!("In close account fn");
        Ok(())
    }
}

#[derive(AnchorSerialize, AnchorDeserialize, InitSpace, Default, Clone, Debug)]
pub struct AuctionInfo {
    #[max_len(50)]
    name: String,
    min_price: u64,
    id_auction: u32,
}

#[derive(AnchorSerialize, AnchorDeserialize, InitSpace, Default, Clone, Debug)]
pub struct BideInfo {
    price: u64,
    bidder: Pubkey,
}

#[account]
#[derive(InitSpace, Default, Debug)]
pub struct Auction {
    /// Actual Info for the auction
    auction_info: AuctionInfo, //base info for the Auction
    bide_info: BideInfo, //live info of the current bidder/price/...
    end_state: bool,     //true if the auction ended
    // Info for solana/anchor
    bump: u8,         //bump of the PDA
    receiver: Pubkey, //use to receive lamport once the account closed
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(
        init,
        payer = user,
        space = 8 + Auction::INIT_SPACE * 10,
        seeds = [b"auction", user.key().as_ref()],
        bump,
    )]
    pub new_auction: Account<'info, Auction>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Bide<'info> {
    pub user: Signer<'info>,
    pub auction: Account<'info, Auction>,
}

#[derive(Accounts)]
pub struct EndAuction<'info> {
    pub user: Signer<'info>,
    pub auction: Account<'info, Auction>,
}

#[derive(Accounts)]
pub struct CloseAccount<'info> {
    #[account(mut, close = receiver, has_one = receiver)]
    pub auction_account: Account<'info, Auction>,
    #[account(mut)]
    pub receiver: Signer<'info>,
}
