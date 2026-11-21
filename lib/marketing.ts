export type Locale = 'tr' | 'en'

const tr = {
  meta: {
    title: 'Chef-AI — Elindekilerle bugün ne pişirsem?',
    description:
      'Elindeki malzemelerden yemek fikri bul. Tarif oluştur, kilerini düzenle ve haftanı planla. Chef-AI, iOS ve Android için hazırlanıyor.',
  },
  nav: {
    features: 'Neler yapabilirsin?',
    how: 'Nasıl çalışır?',
    development: 'Sırada ne var?',
    pricing: 'Erişim ve üyelik',
    open: 'Menüyü aç',
    close: 'Menüyü kapat',
    label: 'Ana gezinme',
    skip: 'İçeriğe geç',
    language: 'Switch to English',
  },
  hero: {
    eyebrow: 'MUTFAKTA FİKİR ARAYANLARA',
    title: 'Elindekilerle bugün ne pişirsem?',
    description:
      'Birkaç malzemeyle başla. Onları değerlendiren bir tarif fikri bul, kilerini düzenle ve haftanın yemeklerini planla.',
    cta: 'Nasıl çalıştığını keşfet',
    note: 'iOS ve Android için hazırlanıyor.',
    pantry: 'ELİNDE NE VAR?',
    ingredients: ['Nohut', 'Domates', 'Ispanak'],
    recipeLabel: 'BİR YEMEK FİKRİ',
    recipe: 'Ispanaklı nohut tavası',
    recipeNote:
      'Malzemelerinden yola çıkan bir başlangıç. Miktarları ve gereken diğer malzemeleri tarifte kontrol et.',
    sample: 'Örnek anlatım; uygulama ekranı değildir',
    journey: 'Malzemeden sofraya',
  },
  features: {
    eyebrow: 'MUTFAĞININ GÜNLÜK AKIŞI',
    title: 'Önce elindekilere bak.',
    intro:
      'Her akşam sıfırdan düşünmek yerine malzemelerini, tariflerini ve haftanı bir araya getir.',
    items: [
      {
        title: 'Malzemelerinden bir fikir çıkar.',
        description:
          'Kilerinden malzeme seç veya kendin yaz. Chef-AI ile bu malzemeleri değerlendiren bir tarif oluştur.',
      },
      {
        title: 'Kilerinde ne var, gör.',
        description:
          'Malzemelerini ve eklediğin tarihleri takip et. Fotoğraftan önerilen malzemeleri kilere eklemeden önce kontrol et.',
      },
      {
        title: 'Haftaya bir yerden başla.',
        description:
          'Haftalık yemek planıyla öğünlerini bir arada düşün. Tarif oluşturma ve planlama, uygulamadaki kullanım haklarına bağlıdır.',
      },
    ],
  },
  how: {
    eyebrow: 'NASIL ÇALIŞIR?',
    title: 'Bir öğün, üç küçük adım.',
    steps: [
      {
        title: 'Malzemelerini ekle',
        description:
          'Elindekileri yaz veya fotoğraftan önerilenleri kontrol ederek seç.',
      },
      {
        title: 'Bir tarif oluştur',
        description:
          'Kullanmak istediğin malzemelerden yola çıkan yemek fikrini incele.',
      },
      {
        title: 'Kontrol et, sonra pişir',
        description:
          'Miktarları, ek malzemeleri ve talimatları gözden geçir. İçeriği kendi ihtiyaçlarına göre değerlendir.',
      },
    ],
    note: 'Fotoğraf analizi ve üretilen tarifler hata içerebilir. Malzemeleri, alerjenleri ve pişirme koşullarını kendin kontrol et.',
  },
  development: {
    eyebrow: 'GELİŞTİRİLİYOR',
    title: 'Tariften sonraki adımlar da yolda.',
    intro:
      'Bu özellikler henüz mevcut test paketinde yer almıyor. Cihaz doğrulamaları tamamlandıktan sonra sunulacak; şu anda kullanıma açık değiller.',
    items: [
      {
        title: 'Alışveriş listesi',
        description:
          'Tarif ve haftalık plandan seçtiğin malzemelerle düzenleyebileceğin bir liste.',
      },
      {
        title: 'Pişirme modu',
        description:
          'Tarif talimatlarını adım adım izleme ve malzemeleri işaretleme.',
      },
      {
        title: 'Mutfak zamanlayıcısı',
        description:
          'Pişirirken süreyi takip etme. Bildirimler izinlere ve cihaz ayarlarına bağlıdır; gecikebilir veya sessiz kalabilir.',
      },
    ],
  },
  access: {
    eyebrow: 'ERİŞİM VE ÜYELİK',
    title: 'Mağazalarda yakında.',
    description:
      'Chef-AI henüz mağazalarda yayımlanmadı. Doğrulanmış indirme bağlantıları hazır olduğunda burada paylaşılacak.',
    free: 'Ücretsiz kullanım',
    freeDetail:
      'Mevcut ürün planında ayda 10 tarif oluşturma hakkı var. Fotoğraf analizi ve haftalık plan haklarını uygulamada görebileceksin.',
    premium: 'Premium',
    premiumDetail:
      'Satın alma henüz açık değil. Açıldığında güncel fiyat ve kullanım hakları uygulamada gösterilecek.',
    soon: 'Yakında',
    storeLabel: 'Mağaza durumu',
    external: 'Yeni sekmede açılır',
  },
  footer: {
    tagline: 'Elindekilerle bir sonraki öğününe fikir bul.',
    rights: 'Tüm hakları saklıdır.',
    nav: 'Alt gezinme',
  },
  invite: {
    metaTitle: "Chef-AI'a davetlisin",
    metaDescription:
      'Chef-AI davet kodunu sakla. Uygulamanın mağaza erişimi ve davet kodu kullanımı henüz açık değil.',
    eyebrow: 'MUTFAĞA DAVETLİSİN',
    title: 'Birlikte yeni yemek fikirleri bulalım.',
    description:
      'Chef-AI, elindeki malzemelerden tarif fikri bulmana, kilerini düzenlemene ve haftanı planlamana yardımcı olmak için hazırlanıyor.',
    code: 'DAVET KODUN',
    note: 'Davet kodu kullanımı henüz açık değil. Kodunu saklayabilirsin.',
    back: 'Chef-AI’ı keşfet',
  },
  notFound: {
    title: 'Bu sayfa menüde yok.',
    description:
      'Bağlantı değişmiş veya davet kodu geçersiz olabilir. Ana sayfadan devam edebilirsin.',
    back: 'Ana sayfaya dön',
    metaTitle: 'Sayfa bulunamadı — Chef-AI',
  },
}

const en: typeof tr = {
  meta: {
    title: 'Chef-AI — What can I cook with what I have?',
    description:
      'Find meal ideas from your ingredients. Create recipes, organize your pantry and plan your week. Chef-AI is coming to iOS and Android.',
  },
  nav: {
    features: 'What you can do',
    how: 'How it works',
    development: 'What’s next',
    pricing: 'Access and membership',
    open: 'Open menu',
    close: 'Close menu',
    label: 'Main navigation',
    skip: 'Skip to content',
    language: 'Türkçeye geç',
  },
  hero: {
    eyebrow: 'FOR YOUR NEXT KITCHEN IDEA',
    title: 'What can I cook with what I have?',
    description:
      'Start with a few ingredients. Find a recipe idea that uses them, organize your pantry and plan the week’s meals.',
    cta: 'Explore how it works',
    note: 'Coming to iOS and Android.',
    pantry: 'WHAT DO YOU HAVE?',
    ingredients: ['Chickpeas', 'Tomatoes', 'Spinach'],
    recipeLabel: 'A MEAL IDEA',
    recipe: 'Chickpea & spinach skillet',
    recipeNote:
      'A starting point inspired by your ingredients. Check the recipe for quantities and anything else you’ll need.',
    sample: 'Illustrative example; not an app screenshot',
    journey: 'From ingredients to the table',
  },
  features: {
    eyebrow: 'YOUR EVERYDAY KITCHEN ROUTINE',
    title: 'Start with what you have.',
    intro:
      'Bring your ingredients, recipes and week together, instead of starting from scratch every evening.',
    items: [
      {
        title: 'Turn ingredients into an idea.',
        description:
          'Pick ingredients from your pantry or type them in. Create a recipe with Chef-AI that puts them to use.',
      },
      {
        title: 'See what’s in your pantry.',
        description:
          'Keep track of your ingredients and the dates you enter. Review ingredients suggested from a photo before adding them.',
      },
      {
        title: 'Give your week a starting point.',
        description:
          'Think through your meals with a weekly meal plan. Recipe creation and meal planning depend on your in-app usage allowance.',
      },
    ],
  },
  how: {
    eyebrow: 'HOW IT WORKS',
    title: 'One meal, three small steps.',
    steps: [
      {
        title: 'Add your ingredients',
        description:
          'Type what you have, or review and select suggestions from a photo.',
      },
      {
        title: 'Create a recipe',
        description:
          'Explore a meal idea built around the ingredients you want to use.',
      },
      {
        title: 'Check, then cook',
        description:
          'Review quantities, extra ingredients and instructions. Assess the recipe for your own needs.',
      },
    ],
    note: 'Photo analysis and generated recipes can contain mistakes. Check ingredients, allergens and cooking conditions yourself.',
  },
  development: {
    eyebrow: 'IN DEVELOPMENT',
    title: 'The next steps after a recipe.',
    intro:
      'These features are not in the current test package. They will be offered after device checks are complete; they are not available yet.',
    items: [
      {
        title: 'Shopping list',
        description:
          'An editable list with ingredients you choose from recipes and your weekly plan.',
      },
      {
        title: 'Cooking mode',
        description:
          'Follow recipe instructions one step at a time and check off ingredients.',
      },
      {
        title: 'Kitchen timer',
        description:
          'Keep track of time while you cook. Notifications depend on permissions and device settings; they may be delayed or silenced.',
      },
    ],
  },
  access: {
    eyebrow: 'ACCESS AND MEMBERSHIP',
    title: 'Coming to the stores.',
    description:
      'Chef-AI is not published in the stores yet. Verified download links will appear here when they are ready.',
    free: 'Free usage',
    freeDetail:
      'The current product plan includes 10 recipe creations per month. Photo analysis and weekly planning allowances will be shown in the app.',
    premium: 'Premium',
    premiumDetail:
      'Purchases are not available yet. When they open, current pricing and usage allowances will be shown in the app.',
    soon: 'Coming soon',
    storeLabel: 'Store availability',
    external: 'Opens in a new tab',
  },
  footer: {
    tagline: 'Find your next meal idea in what you have.',
    rights: 'All rights reserved.',
    nav: 'Footer navigation',
  },
  invite: {
    metaTitle: 'You’re invited to Chef-AI',
    metaDescription:
      'Keep your Chef-AI invite code. Store access and invite code redemption are not available yet.',
    eyebrow: 'YOU’RE INVITED TO THE KITCHEN',
    title: 'Let’s find your next meal idea.',
    description:
      'Chef-AI is being prepared to help you find recipe ideas from your ingredients, organize your pantry and plan your week.',
    code: 'YOUR INVITE CODE',
    note: 'Invite code redemption is not available yet. Keep your code for later.',
    back: 'Explore Chef-AI',
  },
  notFound: {
    title: 'This page isn’t on the menu.',
    description:
      'The link may have changed, or the invite code may be invalid. You can continue from the home page.',
    back: 'Back to the home page',
    metaTitle: 'Page not found — Chef-AI',
  },
}

export const copy = { tr, en }

export const homePath = (locale: Locale) => (locale === 'en' ? '/en' : '/')

export function alternatePath(pathname: string, locale: Locale) {
  const path = pathname === '/en' ? '/' : pathname.replace(/^\/en\//, '/')
  return locale === 'tr' ? `/en${path === '/' ? '' : path}` : path
}

export function inviteCode(raw: string) {
  const code = raw.toUpperCase()
  return /^CHEF-[A-Z0-9]{4,12}$/.test(code) ? code : null
}

export function storeUrl(raw: string | undefined, store: 'ios' | 'android') {
  if (!raw) return null
  try {
    const url = new URL(raw)
    if (
      url.protocol !== 'https:' ||
      url.username ||
      url.password ||
      url.port ||
      url.hash
    )
      return null
    if (
      store === 'ios' &&
      url.hostname === 'apps.apple.com' &&
      /^\/(?:[a-z]{2}\/)?app\/(?:[^/]+\/)?id\d+\/?$/.test(url.pathname)
    )
      return url.href
    if (
      store === 'android' &&
      url.hostname === 'play.google.com' &&
      url.pathname === '/store/apps/details' &&
      /^[a-zA-Z][\w]*(?:\.[a-zA-Z][\w]*)+$/.test(
        url.searchParams.get('id') ?? '',
      )
    )
      return url.href
  } catch {
    return null
  }
  return null
}
