# 🤖 GTCX Commodity Trading Bot Setup

## Bot Creation with @BotFather

### Correct Bot Configuration for COMMODITY TRADING

**Bot Details:**
- **Name**: `GTCX Commodity Exchange`
- **Username**: `@GTCXCommodityBot` or `@GTCXTradeBot`
- **Purpose**: Global commodity trading platform for Africa

### Step 1: Create Bot with @BotFather

**Send these commands:**

```
/newbot
```

**Bot Name**: `GTCX Commodity Exchange`
**Bot Username**: `@GTCXCommodityBot`

### Step 2: Configure Bot Description

```
/setdescription @GTCXCommodityBot
```
**Description:**
```
GTCX - Global Trust and Compliance eXchange. Trade commodities across Africa: gold, cocoa, coffee, oil, agricultural products, and more. Connect buyers and sellers, verify transactions, process payments. Official bot for gtcx.africa platform.
```

### Step 3: Set Bot Commands

```
/setcommands @GTCXCommodityBot
```
**Commands:**
```
start - Welcome to GTCX commodity exchange
register - Register as commodity trader/buyer
trade - Browse available commodities
buy - Purchase commodities
sell - List commodities for sale
verify - Verify trader credentials
wallet - Check payment wallet
prices - Current commodity prices
markets - Market analysis and trends
compliance - Trade compliance reports
profile - View trader profile
support - Get help and support
```

## Bot Features for COMMODITY TRADING

### Core Trading Functions

#### 1. `/start` - Commodity Platform Welcome
```python
def handle_start_command(update, context):
    welcome_message = """
🌍 Welcome to GTCX Commodity Exchange!

Africa's Premier Digital Commodity Trading Platform

Trade Multiple Commodities:
🏆 Gold & Precious Metals
☕ Coffee & Cocoa
🌾 Agricultural Products
🛢️ Oil & Gas
💎 Diamonds & Gemstones
🌽 Grains & Cereals

Features:
✅ Verified traders and buyers
✅ Secure payment processing
✅ Trade compliance & documentation
✅ Real-time market prices
✅ Quality certification

👆 Tap /register to start trading!

🌐 Visit: https://gtcx.africa
📱 Apps: TradePass™ & GeoTag™
    """
    
    keyboard = [
        [InlineKeyboardButton("📝 Register as Trader", callback_data='register_trader')],
        [InlineKeyboardButton("🛒 Browse Commodities", callback_data='browse')],
        [InlineKeyboardButton("📊 Market Prices", callback_data='prices')],
        [InlineKeyboardButton("💰 Payment Setup", callback_data='wallet')]
    ]
    
    update.message.reply_text(welcome_message, reply_markup=InlineKeyboardMarkup(keyboard))
```

#### 2. `/trade` - Commodity Marketplace
```python
def handle_trade_command(update, context):
    trade_message = """
🏪 GTCX Commodity Marketplace

Available Categories:
1️⃣ Precious Metals (Gold, Silver, Platinum)
2️⃣ Agricultural (Cocoa, Coffee, Cashew)
3️⃣ Energy (Oil, Gas, Coal)
4️⃣ Minerals (Bauxite, Manganese, Iron)
5️⃣ Gemstones (Diamonds, Emeralds)

Select a category to view listings:
    """
    
    keyboard = [
        [InlineKeyboardButton("🏆 Precious Metals", callback_data='cat_metals')],
        [InlineKeyboardButton("🌾 Agricultural", callback_data='cat_agri')],
        [InlineKeyboardButton("🛢️ Energy", callback_data='cat_energy')],
        [InlineKeyboardButton("💎 Gemstones", callback_data='cat_gems')],
        [InlineKeyboardButton("⛏️ Minerals", callback_data='cat_minerals')]
    ]
    
    update.message.reply_text(trade_message, reply_markup=InlineKeyboardMarkup(keyboard))
```

#### 3. `/prices` - Live Commodity Prices
```python
def handle_prices_command(update, context):
    prices = get_live_commodity_prices()
    
    price_message = f"""
📊 Live Commodity Prices (gtcx.africa)
Updated: {datetime.now().strftime('%H:%M GMT')}

🏆 **Precious Metals**
Gold: ${prices['gold']}/oz (↑2.3%)
Silver: ${prices['silver']}/oz (↑1.8%)

☕ **Agricultural**
Cocoa: ${prices['cocoa']}/MT (↓0.5%)
Coffee: ${prices['coffee']}/lb (↑3.2%)
Cashew: ${prices['cashew']}/MT (→0.0%)

🛢️ **Energy**
Crude Oil: ${prices['oil']}/barrel (↑1.2%)
Natural Gas: ${prices['gas']}/MMBtu (↓2.1%)

💎 **Gemstones**
Diamond (1ct): ${prices['diamond']}/ct
Emerald: ${prices['emerald']}/ct

📱 Download TradePass™ for advanced trading
    """
    
    update.message.reply_text(price_message, parse_mode='Markdown')
```

### Commodity-Specific Features

#### Multi-Commodity Support
- Gold, silver, platinum trading
- Agricultural products (cocoa, coffee, cashew nuts)
- Oil and gas transactions
- Mineral resources
- Gemstone marketplace

#### Trade Verification
- Trader license verification
- Quality certification checks
- Origin verification (using GeoTag™)
- Compliance documentation

#### Payment Integration
- Mobile Money (MTN, Vodafone, AirtelTigo)
- Bank transfers
- Escrow services
- Multi-currency support (GHS, USD, EUR)

## Integration with GTCX Platform

```python
# Connect to GTCX Commodity API
GTCX_API_BASE = "https://api.gtcx.africa"

def get_commodity_listings(category):
    response = requests.get(f"{GTCX_API_BASE}/commodities/{category}")
    return response.json()

def verify_trader(trader_id):
    response = requests.get(f"{GTCX_API_BASE}/traders/{trader_id}/verify")
    return response.json()

def process_trade(buyer_id, seller_id, commodity, amount):
    trade_data = {
        "buyer": buyer_id,
        "seller": seller_id,
        "commodity": commodity,
        "amount": amount,
        "timestamp": datetime.now().isoformat()
    }
    response = requests.post(f"{GTCX_API_BASE}/trades", json=trade_data)
    return response.json()
```

## Bot Analytics & Metrics

### Track Commodity Trading Activity
- Trade volume by commodity type
- Active traders and buyers
- Transaction success rates
- Popular commodity categories
- Regional trading patterns

**NEXT ACTION**: Create the bot with @BotFather using the COMMODITY TRADING focus, not mining!