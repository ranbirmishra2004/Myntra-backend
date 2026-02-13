const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI);

const products = [
  // Men's Casual - Enhanced
  ...Array.from({ length: 15 }, (_, i) => ({
    name: [
      `Men's Cotton Polo T-Shirt ${i + 1}`,
      `Men's Slim Fit Jeans ${i + 1}`,
      `Men's Casual Shirt ${i + 1}`,
      `Men's Denim Jacket ${i + 1}`,
      `Men's Cargo Pants ${i + 1}`,
      `Men's Hoodie ${i + 1}`,
      `Men's Track Pants ${i + 1}`,
      `Men's V-Neck T-Shirt ${i + 1}`,
      `Men's Chinos ${i + 1}`,
      `Men's Blazer ${i + 1}`,
      `Men's Sweatshirt ${i + 1}`,
      `Men's Shorts ${i + 1}`,
      `Men's Joggers ${i + 1}`,
      `Men's Henley Shirt ${i + 1}`,
      `Men's Bomber Jacket ${i + 1}`
    ][i % 15],
    description: [
      `Premium cotton polo t-shirt with comfortable fit and breathable fabric. Perfect for casual outings and office wear.`,
      `Slim fit jeans with stretchable denim, five-pocket design, and modern cut. Ideal for everyday wear.`,
      `Classic casual shirt with button-down collar and full sleeves. Made from premium cotton blend.`,
      `Vintage style denim jacket with distressed finish and comfortable fit. A wardrobe essential.`,
      `Multi-pocket cargo pants with tactical design and durable fabric. Perfect for outdoor activities.`,
      `Cozy hoodie with kangaroo pocket and adjustable hood. Made from soft fleece material.`,
      `Comfortable track pants with elastic waistband and side pockets. Great for sports and casual wear.`,
      `Stylish V-neck t-shirt with ribbed collar and soft cotton fabric. Versatile and comfortable.`,
      `Tailored chinos with flat front and slim fit. Perfect for smart casual occasions.`,
      `Modern blazer with notch lapel and two-button closure. Ideal for formal and semi-formal events.`,
      `Warm sweatshirt with crew neck and long sleeves. Made from premium cotton-poly blend.`,
      `Casual shorts with elastic waist and multiple pockets. Perfect for summer outings.`,
      `Comfortable joggers with tapered fit and ribbed cuffs. Great for athleisure wear.`,
      `Classic henley shirt with three-button placket and soft fabric. Versatile casual wear.`,
      `Trendy bomber jacket with ribbed cuffs and hem. Modern style with functional design.`
    ][i % 15],
    price: [
      800, 2500, 1200, 3200, 1800, 1500, 1000, 600, 1600, 4500,
      1300, 900, 1100, 950, 2800
    ][i % 15] + Math.floor(Math.random() * 300),
    originalPrice: [
      1000, 3000, 1500, 4000, 2200, 1800, 1200, 800, 2000, 5500,
      1600, 1100, 1300, 1200, 3500
    ][i % 15],
    discount: Math.floor(Math.random() * 30) + 10,
    images: [
      `https://via.placeholder.com/300/${Math.floor(Math.random()*16777215).toString(16)}/ffffff?text=Men+Casual+${i+1}`,
      `https://via.placeholder.com/300/${Math.floor(Math.random()*16777215).toString(16)}/ffffff?text=Men+Casual+${i+1}+View+2`,
      `https://via.placeholder.com/300/${Math.floor(Math.random()*16777215).toString(16)}/ffffff?text=Men+Casual+${i+1}+View+3`
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    category: 'Men Casual',
    brand: ['Levi\'s', 'Nike', 'Adidas', 'Puma', 'H&M', 'Zara', 'Myntra'][i % 7],
    stock: Math.floor(Math.random() * 50) + 10,
  })),
  // Men's Ethnic - Enhanced
  ...Array.from({ length: 12 }, (_, i) => ({
    name: [
      `Men's Kurta Pajama Set ${i + 1}`,
      `Men's Sherwani ${i + 1}`,
      `Men's Nehru Jacket ${i + 1}`,
      `Men's Dhoti ${i + 1}`,
      `Men's Ethnic Shirt ${i + 1}`,
      `Men's Jodhpuri Pants ${i + 1}`,
      `Men's Bandhgala ${i + 1}`,
      `Men's Pathani Suit ${i + 1}`,
      `Men's Angrakha ${i + 1}`,
      `Men's Achkan ${i + 1}`,
      `Men's Churidar ${i + 1}`,
      `Men's Ethnic Jacket ${i + 1}`
    ][i % 12],
    description: [
      `Traditional kurta pajama set made from premium cotton with intricate embroidery and comfortable fit.`,
      `Elegant sherwani with gold zari work and mandarin collar. Perfect for weddings and festivals.`,
      `Classic Nehru jacket with stand collar and front buttons. Ideal for formal ethnic occasions.`,
      `Authentic dhoti with pleats and traditional drape. Made from pure cotton for comfort.`,
      `Contemporary ethnic shirt with subtle prints and modern cut. Fusion of tradition and style.`,
      `Tailored Jodhpuri pants with straight fit and side pockets. Versatile ethnic wear.`,
      `Royal bandhgala with shawl collar and decorative buttons. Traditional formal wear.`,
      `Comfortable Pathani suit with loose kurta and pajamas. Perfect for everyday ethnic wear.`,
      `Stylish angrakha with asymmetric opening and elegant design. Modern ethnic fashion.`,
      `Classic achkan with knee-length design and traditional buttons. Heritage ethnic wear.`,
      `Traditional churidar with fitted design and elasticated waist. Comfortable ethnic pants.`,
      `Contemporary ethnic jacket with modern cuts and traditional motifs. Fusion wear.`
    ][i % 12],
    price: [
      2500, 8500, 3200, 1800, 1500, 2200, 6500, 2800, 4200, 5500,
      1900, 3800
    ][i % 12] + Math.floor(Math.random() * 500),
    originalPrice: [
      3000, 10000, 4000, 2200, 1800, 2700, 8000, 3500, 5000, 7000,
      2300, 4500
    ][i % 12],
    discount: Math.floor(Math.random() * 25) + 5,
    images: [
      `https://via.placeholder.com/300/${Math.floor(Math.random()*16777215).toString(16)}/ffffff?text=Men+Ethnic+${i+1}`,
      `https://via.placeholder.com/300/${Math.floor(Math.random()*16777215).toString(16)}/ffffff?text=Men+Ethnic+${i+1}+View+2`,
      `https://via.placeholder.com/300/${Math.floor(Math.random()*16777215).toString(16)}/ffffff?text=Men+Ethnic+${i+1}+View+3`
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    category: 'Men Ethnic',
    brand: ['Manyavar', 'FabIndia', 'Bungalow', 'Myntra', 'Ethnic'][i % 5],
    stock: Math.floor(Math.random() * 30) + 5,
  })),
  // Men's Footwear - Enhanced
  ...Array.from({ length: 15 }, (_, i) => ({
    name: [
      `Men's Running Shoes ${i + 1}`,
      `Men's Sneakers ${i + 1}`,
      `Men's Formal Shoes ${i + 1}`,
      `Men's Loafers ${i + 1}`,
      `Men's Boots ${i + 1}`,
      `Men's Sandals ${i + 1}`,
      `Men's Sports Shoes ${i + 1}`,
      `Men's Casual Shoes ${i + 1}`,
      `Men's Derby Shoes ${i + 1}`,
      `Men's Brogues ${i + 1}`,
      `Men's Chelsea Boots ${i + 1}`,
      `Men's Flip Flops ${i + 1}`,
      `Men's Basketball Shoes ${i + 1}`,
      `Men's Hiking Boots ${i + 1}`,
      `Men's Dress Shoes ${i + 1}`
    ][i % 15],
    description: [
      `High-performance running shoes with advanced cushioning and breathable mesh upper.`,
      `Stylish sneakers with modern design and comfortable sole. Perfect for casual wear.`,
      `Classic formal shoes with leather finish and comfortable insole. Office wear essential.`,
      `Elegant loafers with slip-on design and penny keeper. Versatile formal-casual wear.`,
      `Durable boots with waterproof finish and ankle support. Great for outdoor activities.`,
      `Comfortable sandals with adjustable straps and cushioned footbed. Summer essential.`,
      `Professional sports shoes with traction and support. Ideal for various sports.`,
      `Casual shoes with synthetic upper and rubber sole. Everyday comfort.`,
      `Traditional derby shoes with brogue detailing and leather construction.`,
      `Classic brogues with perforated design and wingtip detail. Formal elegance.`,
      `Fashionable Chelsea boots with elastic sides and pull tabs. Modern classic.`,
      `Lightweight flip flops with soft straps and contoured footbed. Beach wear.`,
      `Performance basketball shoes with ankle support and cushioning. Court ready.`,
      `Rugged hiking boots with Gore-Tex membrane and traction outsole. Adventure ready.`,
      `Sophisticated dress shoes with cap toe design and polished finish. Formal occasions.`
    ][i % 15],
    price: [
      3500, 2800, 4200, 3200, 5500, 1200, 3800, 2500, 4800, 5200,
      6200, 800, 4500, 7200, 5800
    ][i % 15] + Math.floor(Math.random() * 500),
    originalPrice: [
      4500, 3500, 5500, 4000, 7000, 1500, 4800, 3200, 6000, 6500,
      8000, 1000, 5500, 9000, 7500
    ][i % 15],
    discount: Math.floor(Math.random() * 30) + 10,
    images: [
      `https://via.placeholder.com/300/${Math.floor(Math.random()*16777215).toString(16)}/ffffff?text=Men+Footwear+${i+1}`,
      `https://via.placeholder.com/300/${Math.floor(Math.random()*16777215).toString(16)}/ffffff?text=Men+Footwear+${i+1}+View+2`,
      `https://via.placeholder.com/300/${Math.floor(Math.random()*16777215).toString(16)}/ffffff?text=Men+Footwear+${i+1}+View+3`
    ],
    sizes: ['7', '8', '9', '10', '11', '12'],
    category: 'Men Footwear',
    brand: ['Nike', 'Adidas', 'Puma', 'Reebok', 'Bata', 'Woodland', 'Red Tape'][i % 7],
    stock: Math.floor(Math.random() * 40) + 10,
  })),
  // Women's Western - Enhanced
  ...Array.from({ length: 20 }, (_, i) => ({
    name: [
      `Women's Dress ${i + 1}`,
      `Women's Top ${i + 1}`,
      `Women's Jeans ${i + 1}`,
      `Women's Skirt ${i + 1}`,
      `Women's Blouse ${i + 1}`,
      `Women's Jumpsuit ${i + 1}`,
      `Women's Leggings ${i + 1}`,
      `Women's Sweater ${i + 1}`,
      `Women's Cardigan ${i + 1}`,
      `Women's Jacket ${i + 1}`,
      `Women's Shorts ${i + 1}`,
      `Women's Palazzo ${i + 1}`,
      `Women's Culottes ${i + 1}`,
      `Women's Romper ${i + 1}`,
      `Women's Tunic ${i + 1}`,
      `Women's Shrug ${i + 1}`,
      `Women's Cape ${i + 1}`,
      `Women's Coat ${i + 1}`,
      `Women's Blazer ${i + 1}`,
      `Women's Waistcoat ${i + 1}`
    ][i % 20],
    description: [
      `Elegant dress with flattering fit and premium fabric. Perfect for parties and occasions.`,
      `Stylish top with modern cut and comfortable material. Versatile wardrobe essential.`,
      `High-quality jeans with perfect fit and stretchable denim. Everyday fashion.`,
      `Flowy skirt with beautiful drape and feminine design. Casual and formal wear.`,
      `Classic blouse with intricate details and soft fabric. Traditional and modern.`,
      `Trendy jumpsuit with wide-leg fit and contemporary design. Statement piece.`,
      `Comfortable leggings with high waist and soft material. Athleisure and casual.`,
      `Cozy sweater with crew neck and long sleeves. Winter wardrobe staple.`,
      `Lightweight cardigan with button closure and soft knit. Layering essential.`,
      `Fashionable jacket with modern silhouette and premium finish. Style statement.`,
      `Casual shorts with comfortable fit and trendy design. Summer favorite.`,
      `Wide-leg palazzo pants with elastic waist and flowy design. Boho chic.`,
      `Modern culottes with cropped length and wide fit. Contemporary fashion.`,
      `Playful romper with short sleeves and comfortable fit. Fun and flirty.`,
      `Elegant tunic with asymmetric hem and beautiful prints. Ethnic fusion.`,
      `Delicate shrug with lace details and feminine cut. Evening wear.`,
      `Dramatic cape with flowing design and elegant drape. Red carpet ready.`,
      `Warm coat with belt closure and structured shoulders. Winter elegance.`,
      `Professional blazer with tailored fit and modern design. Office wear.`,
      `Stylish waistcoat with button closure and slim fit. Layering piece.`
    ][i % 20],
    price: [
      1800, 800, 2200, 1500, 1200, 2500, 900, 1600, 1400, 2800,
      1100, 1700, 1900, 2000, 1300, 1000, 3200, 4500, 3500, 2400
    ][i % 20] + Math.floor(Math.random() * 400),
    originalPrice: [
      2200, 1000, 2800, 1800, 1500, 3000, 1100, 2000, 1700, 3500,
      1300, 2100, 2300, 2500, 1600, 1200, 4000, 5500, 4500, 3000
    ][i % 20],
    discount: Math.floor(Math.random() * 35) + 10,
    images: [
      `https://via.placeholder.com/300/${Math.floor(Math.random()*16777215).toString(16)}/ffffff?text=Women+Western+${i+1}`,
      `https://via.placeholder.com/300/${Math.floor(Math.random()*16777215).toString(16)}/ffffff?text=Women+Western+${i+1}+View+2`,
      `https://via.placeholder.com/300/${Math.floor(Math.random()*16777215).toString(16)}/ffffff?text=Women+Western+${i+1}+View+3`
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    category: 'Women Western',
    brand: ['Zara', 'H&M', 'Forever 21', 'Mango', 'Myntra', 'Only', 'Biba'][i % 7],
    stock: Math.floor(Math.random() * 45) + 15,
  })),
  // Women's Ethnic - Enhanced
  ...Array.from({ length: 18 }, (_, i) => ({
    name: [
      `Women's Saree ${i + 1}`,
      `Women's Salwar Suit ${i + 1}`,
      `Women's Lehenga ${i + 1}`,
      `Women's Anarkali ${i + 1}`,
      `Women's Kurti ${i + 1}`,
      `Women's Palazzo Suit ${i + 1}`,
      `Women's Gown ${i + 1}`,
      `Women's Churidar ${i + 1}`,
      `Women's Patiala ${i + 1}`,
      `Women's Dupatta ${i + 1}`,
      `Women's Sharara ${i + 1}`,
      `Women's Kaftan ${i + 1}`,
      `Women's Maxi Dress ${i + 1}`,
      `Women's Plazzo Set ${i + 1}`,
      `Women's Crop Top Kurti ${i + 1}`,
      `Women's Jacket Kurti ${i + 1}`,
      `Women's Cape Kurti ${i + 1}`,
      `Women's Tunic Kurti ${i + 1}`
    ][i % 18],
    description: [
      `Beautiful saree with intricate weaving and rich colors. Traditional elegance.`,
      `Complete salwar suit with embroidered kurti and matching bottoms. Festival ready.`,
      `Stunning lehenga with heavy embroidery and flowing skirt. Wedding wear.`,
      `Graceful Anarkali suit with flared design and delicate work. Festive attire.`,
      `Comfortable kurti with modern cuts and traditional motifs. Daily wear.`,
      `Stylish palazzo suit with wide pants and contemporary design. Fusion wear.`,
      `Elegant gown with flowing silhouette and embellished neckline. Party wear.`,
      `Traditional churidar with fitted kurti and narrow pants. Classic ethnic.`,
      `Patiala salwar with pleats and embroidered kurti. Punjabi traditional.`,
      `Sheer dupatta with border work and lightweight fabric. Saree accessory.`,
      `Flowing sharara with gathered design and elegant kurti. Modern ethnic.`,
      `Relaxed kaftan with side slits and comfortable fit. Bohemian style.`,
      `Long maxi dress with ethnic prints and comfortable fabric. Casual ethnic.`,
      `Matching palazzo set with coordinated kurti and pants. Complete look.`,
      `Trendy crop top kurti with modern silhouette and ethnic prints.`,
      `Layered jacket kurti with contemporary design and traditional elements.`,
      `Dramatic cape kurti with flowing design and modern cuts.`,
      `Simple tunic kurti with straight fit and minimal embroidery.`
    ][i % 18],
    price: [
      2500, 1800, 5500, 3200, 900, 2200, 2800, 1600, 2400, 600,
      3500, 1900, 1700, 2600, 1100, 1400, 2000, 1000
    ][i % 18] + Math.floor(Math.random() * 600),
    originalPrice: [
      3200, 2300, 7000, 4000, 1200, 2800, 3500, 2000, 3000, 800,
      4500, 2400, 2200, 3300, 1400, 1800, 2500, 1300
    ][i % 18],
    discount: Math.floor(Math.random() * 30) + 5,
    images: [
      `https://via.placeholder.com/300/${Math.floor(Math.random()*16777215).toString(16)}/ffffff?text=Women+Ethnic+${i+1}`,
      `https://via.placeholder.com/300/${Math.floor(Math.random()*16777215).toString(16)}/ffffff?text=Women+Ethnic+${i+1}+View+2`,
      `https://via.placeholder.com/300/${Math.floor(Math.random()*16777215).toString(16)}/ffffff?text=Women+Ethnic+${i+1}+View+3`
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'],
    category: 'Women Ethnic',
    brand: ['Biba', 'FabIndia', 'W', 'Myntra', 'Ethnic', 'Anouk'][i % 6],
    stock: Math.floor(Math.random() * 35) + 8,
  })),
  // Beauty Products - Enhanced
  ...Array.from({ length: 25 }, (_, i) => ({
    name: [
      `Foundation ${i + 1}`,
      `Lipstick ${i + 1}`,
      `Mascara ${i + 1}`,
      `Eyeshadow Palette ${i + 1}`,
      `Face Moisturizer ${i + 1}`,
      `Sunscreen ${i + 1}`,
      `Face Wash ${i + 1}`,
      `Hair Oil ${i + 1}`,
      `Shampoo ${i + 1}`,
      `Conditioner ${i + 1}`,
      `Perfume ${i + 1}`,
      `Nail Polish ${i + 1}`,
      `Face Mask ${i + 1}`,
      `Body Lotion ${i + 1}`,
      `Hair Serum ${i + 1}`,
      `BB Cream ${i + 1}`,
      `Concealer ${i + 1}`,
      `Blush ${i + 1}`,
      `Highlighter ${i + 1}`,
      `Setting Powder ${i + 1}`,
      `Eyeliner ${i + 1}`,
      `Brow Pencil ${i + 1}`,
      `Lip Gloss ${i + 1}`,
      `Face Scrub ${i + 1}`,
      `Body Wash ${i + 1}`
    ][i % 25],
    description: [
      `Long-lasting foundation with natural finish and skin-loving ingredients.`,
      `Creamy lipstick with rich color payoff and moisturizing formula.`,
      `Volumizing mascara that defines and lengthens lashes beautifully.`,
      `Versatile eyeshadow palette with highly pigmented and blendable shades.`,
      `Hydrating moisturizer that nourishes and protects the skin.`,
      `Broad spectrum sunscreen with SPF 50+ protection.`,
      `Gentle face wash that cleanses without stripping natural moisture.`,
      `Nourishing hair oil that promotes healthy and shiny hair.`,
      `Sulfate-free shampoo that gently cleanses and strengthens hair.`,
      `Deep conditioning treatment for soft and manageable hair.`,
      `Elegant fragrance with long-lasting and captivating scent.`,
      `Quick-drying nail polish with chip-resistant and vibrant colors.`,
      `Hydrating face mask that rejuvenates and refreshes the skin.`,
      `Lightweight body lotion that moisturizes and softens the skin.`,
      `Silky hair serum that tames frizz and adds shine.`,
      `Multi-tasking BB cream that evens skin tone and provides light coverage.`,
      `Full coverage concealer that hides imperfections flawlessly.`,
      `Natural-looking blush that adds a healthy flush to cheeks.`,
      `Illuminating highlighter that creates a radiant and glowing effect.`,
      `Translucent setting powder that sets makeup for long-lasting wear.`,
      `Precise eyeliner that creates defined and dramatic eye looks.`,
      `Natural brow pencil that shapes and defines eyebrows perfectly.`,
      `Shimmery lip gloss that adds volume and shine to lips.`,
      `Gentle exfoliating scrub that removes dead skin cells.`,
      `Refreshing body wash that cleanses and invigorates the skin.`
    ][i % 25],
    price: [
      800, 400, 600, 1200, 500, 700, 300, 350, 450, 450,
      1500, 200, 250, 400, 600, 650, 550, 450, 700, 500,
      350, 300, 350, 400, 350
    ][i % 25] + Math.floor(Math.random() * 200),
    originalPrice: [
      1000, 500, 750, 1500, 650, 900, 400, 450, 550, 550,
      1800, 250, 300, 500, 750, 800, 700, 550, 900, 650,
      450, 400, 450, 500, 450
    ][i % 25],
    discount: Math.floor(Math.random() * 25) + 5,
    images: [
      `https://via.placeholder.com/300/${Math.floor(Math.random()*16777215).toString(16)}/ffffff?text=Beauty+${i+1}`,
      `https://via.placeholder.com/300/${Math.floor(Math.random()*16777215).toString(16)}/ffffff?text=Beauty+${i+1}+View+2`
    ],
    sizes: ['Standard'],
    category: 'Beauty',
    brand: ['Lakme', 'Maybelline', 'L\'Oreal', 'MAC', 'Nivea', 'Dove', 'Garnier'][i % 7],
    stock: Math.floor(Math.random() * 60) + 20,
  })),
  // Fashion Accessories - Enhanced
  ...Array.from({ length: 20 }, (_, i) => ({
    name: [
      `Women's Handbag ${i + 1}`,
      `Women's Watch ${i + 1}`,
      `Sunglasses ${i + 1}`,
      `Jewelry Set ${i + 1}`,
      `Hair Accessories ${i + 1}`,
      `Scarves ${i + 1}`,
      `Belts ${i + 1}`,
      `Women's Wallet ${i + 1}`,
      `Hair Clips ${i + 1}`,
      `Necklace ${i + 1}`,
      `Earrings ${i + 1}`,
      `Bracelet ${i + 1}`,
      `Rings ${i + 1}`,
      `Anklets ${i + 1}`,
      `Hair Bands ${i + 1}`,
      `Caps ${i + 1}`,
      `Gloves ${i + 1}`,
      `Ties ${i + 1}`,
      `Cufflinks ${i + 1}`,
      `Pocket Squares ${i + 1}`
    ][i % 20],
    description: [
      `Stylish handbag with spacious compartments and premium leather finish.`,
      `Elegant watch with stainless steel case and water-resistant design.`,
      `Trendy sunglasses with UV protection and lightweight frames.`,
      `Complete jewelry set with necklace, earrings, and matching bracelet.`,
      `Beautiful hair accessories including clips, bands, and ties.`,
      `Silk scarf with elegant prints and lightweight fabric.`,
      `Leather belt with classic buckle and adjustable fit.`,
      `Compact wallet with multiple card slots and coin compartment.`,
      `Decorative hair clips with crystal embellishments.`,
      `Delicate necklace with pendant and adjustable chain.`,
      `Statement earrings with intricate design and comfortable fit.`,
      `Stackable bracelet with charms and adjustable clasp.`,
      `Fashion rings with unique designs and comfortable wear.`,
      `Elegant anklets with bells and adjustable length.`,
      `Silk hair bands in various colors and patterns.`,
      `Casual caps with adjustable straps and breathable fabric.`,
      `Warm gloves with leather finish and comfortable lining.`,
      `Silk ties with classic patterns and perfect knot.`,
      `Silver cufflinks with engraved design and secure closure.`,
      `Cotton pocket squares with complementary patterns.`
    ][i % 20],
    price: [
      2500, 3500, 1200, 1800, 300, 800, 900, 600, 200, 1200,
      800, 600, 500, 400, 150, 500, 700, 600, 800, 300
    ][i % 20] + Math.floor(Math.random() * 300),
    originalPrice: [
      3200, 4500, 1500, 2300, 400, 1000, 1200, 800, 250, 1500,
      1000, 750, 650, 500, 200, 650, 900, 750, 1000, 400
    ][i % 20],
    discount: Math.floor(Math.random() * 30) + 10,
    images: [
      `https://via.placeholder.com/300/${Math.floor(Math.random()*16777215).toString(16)}/ffffff?text=Accessory+${i+1}`,
      `https://via.placeholder.com/300/${Math.floor(Math.random()*16777215).toString(16)}/ffffff?text=Accessory+${i+1}+View+2`
    ],
    sizes: ['One Size'],
    category: 'Fashion',
    brand: ['Fossil', 'Ray-Ban', 'Myntra', 'Accessories', 'Fashion'][i % 5],
    stock: Math.floor(Math.random() * 40) + 15,
  })),
  // Kids Collection - Enhanced
  ...Array.from({ length: 30 }, (_, i) => ({
    name: [
      `Kids T-Shirt ${i + 1}`,
      `Kids Jeans ${i + 1}`,
      `Kids Dress ${i + 1}`,
      `Kids Shorts ${i + 1}`,
      `Kids Hoodie ${i + 1}`,
      `Kids Skirt ${i + 1}`,
      `Kids Jacket ${i + 1}`,
      `Kids Pajamas ${i + 1}`,
      `Kids Sweater ${i + 1}`,
      `Kids Leggings ${i + 1}`,
      `Kids Top ${i + 1}`,
      `Kids Pants ${i + 1}`,
      `Kids Jumpsuit ${i + 1}`,
      `Kids Romper ${i + 1}`,
      `Kids Overalls ${i + 1}`,
      `Kids Cardigan ${i + 1}`,
      `Kids Cap ${i + 1}`,
      `Kids Shoes ${i + 1}`,
      `Kids Sandals ${i + 1}`,
      `Kids Boots ${i + 1}`,
      `Kids Socks ${i + 1}`,
      `Kids Gloves ${i + 1}`,
      `Kids Scarf ${i + 1}`,
      `Kids Hat ${i + 1}`,
      `Kids Belt ${i + 1}`,
      `Kids Backpack ${i + 1}`,
      `Kids Water Bottle ${i + 1}`,
      `Kids Lunch Box ${i + 1}`,
      `Kids Toys ${i + 1}`,
      `Kids Books ${i + 1}`
    ][i % 30],
    description: [
      `Comfortable cotton t-shirt with fun prints and soft fabric for kids.`,
      `Durable jeans with stretch and easy fit for active kids.`,
      `Pretty dress with beautiful patterns and comfortable design.`,
      `Casual shorts with elastic waist and playful designs.`,
      `Cozy hoodie with fun characters and warm material.`,
      `Flowy skirt with bright colors and twirl-worthy design.`,
      `Lightweight jacket for outdoor play and protection.`,
      `Soft pajamas with cute prints for comfortable sleep.`,
      `Warm sweater with fun patterns and cozy knit.`,
      `Stretchy leggings with comfortable fit and fun colors.`,
      `Stylish top with trendy designs and soft material.`,
      `Comfortable pants with easy movement and durable fabric.`,
      `Adorable jumpsuit with snaps and easy dressing.`,
      `Cute romper with short sleeves and playful patterns.`,
      `Practical overalls with adjustable straps and pockets.`,
      `Light cardigan for layering and cute button details.`,
      `Fun cap with adjustable strap and sun protection.`,
      `Comfortable shoes with flexible sole and easy fastening.`,
      `Light sandals with adjustable straps for summer fun.`,
      `Warm boots with waterproof design and easy pull-on.`,
      `Colorful socks with fun patterns and soft material.`,
      `Warm gloves for cold weather and outdoor play.`,
      `Soft scarf with fun designs and warm fabric.`,
      `Cute hat with ear flaps and warm lining.`,
      `Adjustable belt with fun buckle for pants.`,
      `Sturdy backpack with fun designs and compartments.`,
      `Insulated water bottle with fun colors and easy grip.`,
      `Fun lunch box with compartments and cute design.`,
      `Educational toys that promote learning and fun.`,
      `Colorful books with engaging stories and illustrations.`
    ][i % 30],
    price: [
      400, 600, 500, 350, 550, 450, 650, 400, 500, 300,
      350, 450, 550, 400, 500, 450, 250, 700, 400, 800,
      150, 200, 250, 300, 200, 600, 300, 350, 400, 250
    ][i % 30] + Math.floor(Math.random() * 150),
    originalPrice: [
      500, 750, 650, 450, 700, 550, 800, 500, 650, 400,
      450, 550, 700, 500, 650, 550, 300, 900, 500, 1000,
      200, 250, 300, 400, 250, 750, 400, 450, 500, 300
    ][i % 30],
    discount: Math.floor(Math.random() * 25) + 5,
    images: [
      `https://via.placeholder.com/300/${Math.floor(Math.random()*16777215).toString(16)}/ffffff?text=Kids+${i+1}`,
      `https://via.placeholder.com/300/${Math.floor(Math.random()*16777215).toString(16)}/ffffff?text=Kids+${i+1}+View+2`
    ],
    sizes: ['2-3Y', '4-5Y', '6-7Y', '8-9Y', '10-11Y', '12-13Y', '14-15Y'],
    category: ['Kids Girls', 'Kids Boys', 'Kids Infants', 'Kids Teens'][i % 4],
    brand: ['Myntra', 'Kids', 'Little', 'Tiny', 'Fun'][i % 5],
    stock: Math.floor(Math.random() * 50) + 20,
  })),
];

const seedDB = async () => {
  await Product.deleteMany({});
  await Product.insertMany(products);
  console.log('Database seeded');
  process.exit();
};

seedDB();