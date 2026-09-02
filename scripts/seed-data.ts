export interface SeedProduct {
  name: string;
  description: string;
  price: number;
  category: string;
  stock_qty: number;
  unsplashQuery: string;
}

export const PRODUCTS: SeedProduct[] = [
  // Candles
  { name: "Amber & Oakmoss Soy Candle", description: "A warm, resinous blend of amber, oakmoss, and a whisper of sandalwood, hand-poured into a reusable matte ceramic vessel. 45-hour burn time.", price: 28, category: "Candles", stock_qty: 24, unsplashQuery: "soy candle amber jar" },
  { name: "Fig Leaf & Cedar Candle", description: "Green fig leaf and clean cedarwood layered over a soft musk base — grown-up, unfussy, and easy to live with in any room.", price: 32, category: "Candles", stock_qty: 18, unsplashQuery: "fig candle glass jar" },
  { name: "Smoked Vanilla Bean Pillar Candle", description: "A slow-burning unscented-wax pillar infused with smoked vanilla and dark tonka bean. Stands on its own — no vessel needed.", price: 24, category: "Candles", stock_qty: 30, unsplashQuery: "pillar candle vanilla" },
  { name: "Sea Salt & Driftwood Candle", description: "Salt-washed and mineral, with notes of driftwood and ambergris. Poured in a frosted glass tumbler you'll want to keep long after.", price: 30, category: "Candles", stock_qty: 22, unsplashQuery: "sea salt candle coastal" },
  { name: "Palo Santo & Clove Travel Candle", description: "A pocket-sized tin candle for smaller spaces — smoky palo santo warmed with clove and a touch of orange peel.", price: 18, category: "Candles", stock_qty: 40, unsplashQuery: "travel tin candle" },
  { name: "Unscented Beeswax Taper Set (6)", description: "Pure beeswax tapers with a natural honey-gold hue and a clean, drip-slow burn. Sold in a set of six, unscented.", price: 22, category: "Candles", stock_qty: 26, unsplashQuery: "beeswax taper candles" },
  { name: "Juniper & Wild Moss Concrete Candle", description: "Poured into a hand-cast concrete vessel that doubles as a catch-all after the wax is gone. Scented with juniper berry and wild moss.", price: 34, category: "Candles", stock_qty: 16, unsplashQuery: "concrete candle vessel" },
  { name: "Black Fig & Espresso Candle", description: "Deep, moody, and a little indulgent — black fig, roasted espresso bean, and dark plum in a matte black jar.", price: 29, category: "Candles", stock_qty: 20, unsplashQuery: "black jar candle dark" },
  { name: "Citrus Grove Ceramic Vessel Candle", description: "Bright bergamot, blood orange, and a hint of mint, hand-poured into a keepsake stoneware vessel thrown in small batches.", price: 26, category: "Candles", stock_qty: 24, unsplashQuery: "ceramic candle citrus" },

  // Planters & Pots
  { name: "Terracotta Ribbed Planter — Small", description: "Fluted terracotta with a raw, unglazed finish that weathers beautifully outdoors or in. Fits most 4-inch nursery pots.", price: 24, category: "Planters & Pots", stock_qty: 34, unsplashQuery: "ribbed terracotta planter" },
  { name: "Terracotta Ribbed Planter — Large", description: "The larger sibling to our ribbed terracotta planter — roomy enough for a fiddle-leaf fig or a full herb garden.", price: 38, category: "Planters & Pots", stock_qty: 20, unsplashQuery: "large terracotta pot plant" },
  { name: "Speckled Stoneware Planter with Saucer", description: "Hand-thrown stoneware in a warm speckled glaze, with a matching saucer to protect windowsills and shelves.", price: 32, category: "Planters & Pots", stock_qty: 28, unsplashQuery: "speckled ceramic planter" },
  { name: "Matte Black Cylinder Planter", description: "A clean-lined cylinder in a soft matte black glaze — the quiet, modern counterpoint to a leafy plant.", price: 27, category: "Planters & Pots", stock_qty: 25, unsplashQuery: "black cylinder planter" },
  { name: "Woven Rattan Plant Basket", description: "A hand-woven rattan sleeve that slips over your existing nursery pot, adding texture without repotting.", price: 36, category: "Planters & Pots", stock_qty: 22, unsplashQuery: "rattan plant basket" },
  { name: "Concrete Hexagon Planter Trio", description: "Three hand-cast concrete hexagons in graduated sizes, perfect for succulents or a windowsill herb trio.", price: 42, category: "Planters & Pots", stock_qty: 15, unsplashQuery: "concrete planter succulent" },
  { name: "Hanging Macrame Plant Holder", description: "Hand-knotted natural cotton cord in a classic macrame pattern, sized to hold a 6-inch pot.", price: 29, category: "Planters & Pots", stock_qty: 30, unsplashQuery: "macrame plant hanger" },
  { name: "Fluted Ceramic Planter — Sage Green", description: "A soft sage glaze over a fluted stoneware body, striking a balance between playful and understated.", price: 31, category: "Planters & Pots", stock_qty: 19, unsplashQuery: "green ceramic planter" },
  { name: "Aged Clay Bulb Planter", description: "A compact clay vessel designed for spring bulbs or a single trailing plant — develops a lovely patina over time.", price: 19, category: "Planters & Pots", stock_qty: 38, unsplashQuery: "clay pot small plant" },

  // Ceramics & Tableware
  { name: "Hand-Thrown Stoneware Dinner Plate Set (4)", description: "Four hand-thrown stoneware dinner plates in a warm oatmeal glaze, each one subtly unique. Dishwasher and microwave safe.", price: 68, category: "Ceramics & Tableware", stock_qty: 16, unsplashQuery: "stoneware dinner plates" },
  { name: "Speckled Ceramic Mug — Set of 2", description: "Generous 12oz mugs in a speckled stoneware glaze with a comfortable, wide handle built for slow mornings.", price: 34, category: "Ceramics & Tableware", stock_qty: 32, unsplashQuery: "speckled ceramic mug" },
  { name: "Organic Edge Serving Bowl", description: "A large stoneware serving bowl with a gently irregular hand-formed edge — equally at home holding salad or fruit.", price: 46, category: "Ceramics & Tableware", stock_qty: 18, unsplashQuery: "ceramic serving bowl" },
  { name: "Reactive Glaze Pasta Bowls — Set of 4", description: "Deep pasta bowls finished in a reactive glaze so each piece pools with its own one-of-a-kind pattern.", price: 72, category: "Ceramics & Tableware", stock_qty: 14, unsplashQuery: "ceramic pasta bowl" },
  { name: "Minimalist Ceramic Butter Dish", description: "A lidded stoneware butter dish with a soft matte finish, sized for a standard stick of butter.", price: 22, category: "Ceramics & Tableware", stock_qty: 26, unsplashQuery: "ceramic butter dish" },
  { name: "Handmade Stoneware Pitcher", description: "A 1.5-liter stoneware pitcher, hand-thrown with a comfortable pulled handle and a clean pouring lip.", price: 38, category: "Ceramics & Tableware", stock_qty: 20, unsplashQuery: "ceramic pitcher jug" },
  { name: "Ribbed Ceramic Vase — Cream", description: "A fluted, ribbed silhouette in a soft cream glaze — as striking empty as it is filled with dried stems.", price: 33, category: "Ceramics & Tableware", stock_qty: 24, unsplashQuery: "ceramic vase cream" },
  { name: "Textured Salt & Pepper Cellars", description: "A pair of small hand-formed stoneware cellars with a lightly textured exterior — no shakers required.", price: 24, category: "Ceramics & Tableware", stock_qty: 30, unsplashQuery: "ceramic salt cellar" },
  { name: "Glazed Ceramic Fruit Bowl", description: "A footed stoneware fruit bowl in a deep glossy glaze, sized generously for everyday countertop use.", price: 44, category: "Ceramics & Tableware", stock_qty: 17, unsplashQuery: "ceramic fruit bowl" },

  // Textiles & Throws
  { name: "Chunky Knit Throw Blanket", description: "An oversized chunky-knit throw in undyed wool-blend yarn — the definition of a cozy warm blanket for a reading nook.", price: 78, category: "Textiles & Throws", stock_qty: 22, unsplashQuery: "chunky knit throw blanket" },
  { name: "Waffle Weave Cotton Throw", description: "Lightweight, breathable waffle-weave cotton in a soft oat tone — a year-round throw for the sofa or foot of the bed.", price: 52, category: "Textiles & Throws", stock_qty: 28, unsplashQuery: "cotton waffle throw blanket" },
  { name: "Vintage Wash Linen Duvet Cover", description: "Stonewashed European linen with a relaxed, lived-in drape that softens with every wash. Queen size.", price: 128, category: "Textiles & Throws", stock_qty: 12, unsplashQuery: "linen duvet cover bed" },
  { name: "Handwoven Wool Lumbar Pillow Cover", description: "A handwoven wool-blend lumbar cover in a subtle striped texture, sized for a 12x20 insert.", price: 36, category: "Textiles & Throws", stock_qty: 24, unsplashQuery: "lumbar pillow cover wool" },
  { name: "Slub Linen Table Runner", description: "Textured slub linen in warm putty, hemmed by hand — sets a table without saying too much.", price: 28, category: "Textiles & Throws", stock_qty: 30, unsplashQuery: "linen table runner" },
  { name: "Organic Cotton Bath Towel Set", description: "A set of two GOTS-certified organic cotton bath towels, heavyweight and quick-drying in a warm clay tone.", price: 56, category: "Textiles & Throws", stock_qty: 20, unsplashQuery: "cotton bath towel folded" },
  { name: "Mudcloth-Inspired Throw Pillow Cover", description: "Hand-printed geometric pattern inspired by traditional mudcloth, on heavyweight cotton canvas. Insert not included.", price: 32, category: "Textiles & Throws", stock_qty: 26, unsplashQuery: "patterned throw pillow" },
  { name: "Alpaca Blend Fringe Throw", description: "An exceptionally soft alpaca-wool blend throw with a hand-knotted fringe edge — the kind of throw that lives on the arm of the sofa.", price: 118, category: "Textiles & Throws", stock_qty: 10, unsplashQuery: "wool fringe throw blanket sofa" },
  { name: "Linen Napkin Set (4)", description: "Four stonewashed linen napkins in warm neutral tones, mitered corners, machine washable.", price: 24, category: "Textiles & Throws", stock_qty: 34, unsplashQuery: "linen napkins table" },

  // Wall Decor
  { name: "Woven Wall Hanging — Natural Fiber", description: "A hand-woven wall hanging in undyed jute and cotton, textured with rows of rya knots. 24 inches wide.", price: 58, category: "Wall Decor", stock_qty: 16, unsplashQuery: "woven wall hanging tapestry" },
  { name: "Dried Botanical Wall Frame", description: "Pressed native grasses and dried florals, framed under glass in a slim natural-wood frame.", price: 44, category: "Wall Decor", stock_qty: 20, unsplashQuery: "dried flowers framed wall art" },
  { name: "Ceramic Sconce Vase — Set of 2", description: "Wall-mounted stoneware bud vases that hold a single stem each — a quiet way to bring greenery to a wall.", price: 36, category: "Wall Decor", stock_qty: 22, unsplashQuery: "wall vase ceramic sconce" },
  { name: "Abstract Terracotta Wall Art", description: "A hand-formed terracotta relief panel with an abstract, organic silhouette — sculptural without being loud.", price: 64, category: "Wall Decor", stock_qty: 12, unsplashQuery: "terracotta wall art sculpture" },
  { name: "Rattan Mirror — Round", description: "A round mirror framed in hand-woven rattan, 28-inch diameter — warms up any entryway or bathroom.", price: 88, category: "Wall Decor", stock_qty: 14, unsplashQuery: "rattan round mirror" },
  { name: "Pressed Leaf Art Print, Framed", description: "A giclée print of a single pressed botanical leaf, framed in matte black — part of a growing collection of nature studies.", price: 42, category: "Wall Decor", stock_qty: 24, unsplashQuery: "botanical print framed wall" },
  { name: "Woven Rattan Wall Plate Trio", description: "Three hand-woven rattan plates in graduated sizes, arranged as sculptural wall decor — a warm-toned callback to heritage craft.", price: 52, category: "Wall Decor", stock_qty: 18, unsplashQuery: "rattan wall plates decor" },
  { name: "Minimalist Line Art Print — Set of 3", description: "A trio of framed single-line figure studies, printed on archival matte paper in a warm off-white mat.", price: 54, category: "Wall Decor", stock_qty: 20, unsplashQuery: "line art print set framed" },
  { name: "Capiz Shell Wall Panel", description: "Iridescent capiz shell tiles set into a wood frame, catching light in soft, shifting pastels.", price: 70, category: "Wall Decor", stock_qty: 11, unsplashQuery: "capiz shell wall decor" },

  // Storage Baskets
  { name: "Seagrass Storage Basket — Large", description: "A generously sized seagrass basket with sturdy handles — equally suited to blankets, toys, or laundry.", price: 46, category: "Storage Baskets", stock_qty: 22, unsplashQuery: "seagrass storage basket" },
  { name: "Woven Lidded Storage Basket", description: "A lidded basket hand-woven from water hyacinth, keeping clutter out of sight without sacrificing style.", price: 54, category: "Storage Baskets", stock_qty: 18, unsplashQuery: "lidded woven basket" },
  { name: "Jute Laundry Basket with Handles", description: "A sturdy jute laundry basket with reinforced leather handles and a removable cotton liner.", price: 48, category: "Storage Baskets", stock_qty: 20, unsplashQuery: "jute laundry basket" },
  { name: "Nesting Rattan Baskets — Set of 3", description: "Three hand-woven rattan baskets that nest for easy storage, sized for everything from mail to throw blankets.", price: 66, category: "Storage Baskets", stock_qty: 16, unsplashQuery: "nesting rattan baskets" },
  { name: "Water Hyacinth Bin — Small", description: "A compact woven bin for the entryway or bathroom shelf, holding small essentials with quiet texture.", price: 28, category: "Storage Baskets", stock_qty: 30, unsplashQuery: "small woven storage bin" },
  { name: "Collapsible Woven Storage Cube", description: "A soft-sided woven storage cube that folds flat when not needed — practical without looking it.", price: 32, category: "Storage Baskets", stock_qty: 26, unsplashQuery: "woven storage cube" },
  { name: "Belly Basket Planter/Storage", description: "The classic rounded belly basket — oversized, hand-woven, and equally happy holding a plant or a pile of blankets.", price: 38, category: "Storage Baskets", stock_qty: 24, unsplashQuery: "belly basket storage" },
  { name: "Woven Document & Magazine Holder", description: "A slim woven holder that keeps mail, magazines, and loose papers corralled on a console or desk.", price: 30, category: "Storage Baskets", stock_qty: 28, unsplashQuery: "woven magazine holder basket" },
  { name: "Palm Leaf Catch-All Tray", description: "A shallow hand-woven palm leaf tray for keys, jewelry, or whatever lands on the counter at the end of the day.", price: 22, category: "Storage Baskets", stock_qty: 36, unsplashQuery: "woven catchall tray" },
];
