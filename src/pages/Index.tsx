import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const categories = [
  { name: 'Все категории', icon: 'Grid3x3', count: 1250 },
  { name: 'Электроника', icon: 'Smartphone', count: 320 },
  { name: 'Одежда', icon: 'ShoppingBag', count: 450 },
  { name: 'Рестораны', icon: 'UtensilsCrossed', count: 180 },
  { name: 'Услуги', icon: 'Wrench', count: 220 },
  { name: 'Здоровье', icon: 'Heart', count: 80 }
];

const reviews = [
  {
    id: 1,
    company: 'TechnoMart',
    category: 'Электроника',
    rating: 4.8,
    totalReviews: 1249,
    author: 'Анна Петрова',
    avatar: '',
    date: '2 дня назад',
    text: 'Отличный магазин! Быстрая доставка, качественные товары. Консультанты помогли выбрать идеальный ноутбук. Обязательно вернусь за следующей покупкой.',
    likes: 42,
    verified: true
  },
  {
    id: 2,
    company: 'Модный Стиль',
    category: 'Одежда',
    rating: 4.6,
    totalReviews: 856,
    author: 'Дмитрий Иванов',
    avatar: '',
    date: '5 дней назад',
    text: 'Большой выбор брендовой одежды по доступным ценам. Качество соответствует описанию. Немного долгая доставка, но результат того стоит!',
    likes: 28,
    verified: true
  },
  {
    id: 3,
    company: 'Вкусно & Точка',
    category: 'Рестораны',
    rating: 4.9,
    totalReviews: 2341,
    author: 'Елена Смирнова',
    avatar: '',
    date: '1 неделю назад',
    text: 'Лучший ресторан в городе! Потрясающая кухня, уютная атмосфера и внимательный персонал. Особенно рекомендую пасту карбонара.',
    likes: 67,
    verified: true
  },
  {
    id: 4,
    company: 'Быстрый Сервис',
    category: 'Услуги',
    rating: 4.4,
    totalReviews: 432,
    author: 'Михаил Козлов',
    avatar: '',
    date: '3 дня назад',
    text: 'Качественный ремонт техники. Мастер приехал в тот же день, быстро диагностировал проблему и починил. Цены адекватные.',
    likes: 19,
    verified: false
  }
];

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Все категории');

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         review.text.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Все категории' || review.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Icon key={`full-${i}`} name="Star" className="w-5 h-5 fill-amber-400 text-amber-400" />);
    }
    if (hasHalfStar) {
      stars.push(<Icon key="half" name="StarHalf" className="w-5 h-5 fill-amber-400 text-amber-400" />);
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Icon key={`empty-${i}`} name="Star" className="w-5 h-5 text-gray-300" />);
    }
    return stars;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Отзывы и Рейтинги
          </h1>
          <p className="text-xl text-muted-foreground">
            Найдите проверенные отзывы о компаниях и товарах
          </p>
        </div>

        <div className="max-w-3xl mx-auto mb-12 animate-scale-in">
          <div className="relative">
            <Icon name="Search" className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              type="text"
              placeholder="Поиск по компаниям, товарам, категориям..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 text-lg border-2 focus:border-primary shadow-lg backdrop-blur-sm bg-white/80"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3 justify-center mb-12 animate-fade-in">
          {categories.map((category) => (
            <Button
              key={category.name}
              variant={selectedCategory === category.name ? 'default' : 'outline'}
              size="lg"
              onClick={() => setSelectedCategory(category.name)}
              className="gap-2 transition-all hover:scale-105"
            >
              <Icon name={category.icon} className="w-5 h-5" />
              {category.name}
              <Badge variant="secondary" className="ml-1">
                {category.count}
              </Badge>
            </Button>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          {filteredReviews.map((review, index) => (
            <Card 
              key={review.id} 
              className="overflow-hidden transition-all hover:shadow-2xl hover:-translate-y-1 animate-fade-in backdrop-blur-sm bg-white/90 border-2"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-2xl mb-2 flex items-center gap-2">
                      {review.company}
                      {review.verified && (
                        <Badge variant="default" className="gap-1">
                          <Icon name="BadgeCheck" className="w-3 h-3" />
                          Проверено
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription className="text-base">
                      <Badge variant="outline" className="gap-1">
                        <Icon name="Tag" className="w-3 h-3" />
                        {review.category}
                      </Badge>
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-primary mb-1">
                      {review.rating}
                    </div>
                    <div className="flex gap-0.5 mb-1">
                      {renderStars(review.rating)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {review.totalReviews} отзывов
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3 mb-4">
                  <Avatar className="w-10 h-10 border-2 border-primary">
                    <AvatarImage src={review.avatar} />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white">
                      {review.author.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-semibold text-foreground">{review.author}</div>
                    <div className="text-sm text-muted-foreground">{review.date}</div>
                  </div>
                </div>
                <p className="text-base leading-relaxed text-foreground/90 mb-4">
                  {review.text}
                </p>
                <div className="flex items-center justify-between pt-4 border-t">
                  <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-primary">
                    <Icon name="ThumbsUp" className="w-4 h-4" />
                    Полезно ({review.likes})
                  </Button>
                  <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-primary">
                    <Icon name="MessageSquare" className="w-4 h-4" />
                    Ответить
                  </Button>
                  <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-primary">
                    <Icon name="Share2" className="w-4 h-4" />
                    Поделиться
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredReviews.length === 0 && (
          <div className="text-center py-16 animate-fade-in">
            <Icon name="SearchX" className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Ничего не найдено</h3>
            <p className="text-muted-foreground">Попробуйте изменить параметры поиска</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
