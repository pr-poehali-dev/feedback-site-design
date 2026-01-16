import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

interface Review {
  id: number;
  author: string;
  date: string;
  text: string;
  rating: number;
  likes: number;
  verified: boolean;
}

interface Star {
  id: number;
  x: number;
  y: number;
  speed: number;
}

interface Reward {
  id: number;
  name: string;
  description: string;
  cost: number;
  icon: string;
  emoji: string;
  discount?: number;
  type: 'discount' | 'bonus' | 'gift';
}

interface PurchasedReward {
  id: number;
  rewardId: number;
  reward: Reward;
  purchasedAt: string;
  used: boolean;
  code?: string;
}

const initialReviews: Review[] = [
  {
    id: 1,
    author: 'Анна Петрова',
    date: '2 дня назад',
    text: 'Отличный магазин! Быстрая доставка, качественные товары. Консультанты помогли выбрать идеальный ноутбук.',
    rating: 5,
    likes: 42,
    verified: true
  },
  {
    id: 2,
    author: 'Дмитрий Иванов',
    date: '5 дней назад',
    text: 'Большой выбор товаров по доступным ценам. Качество соответствует описанию.',
    rating: 4,
    likes: 28,
    verified: true
  }
];

const rewards: Reward[] = [
  { id: 1, name: 'Скидка 5%', description: 'Скидка на любую покупку', cost: 100, icon: 'Ticket', emoji: '🎟️', discount: 5, type: 'discount' },
  { id: 2, name: 'Скидка 10%', description: 'Скидка на любую покупку', cost: 200, icon: 'TicketPercent', emoji: '🎫', discount: 10, type: 'discount' },
  { id: 3, name: 'Скидка 15%', description: 'Скидка на покупку от 5000₽', cost: 350, icon: 'BadgePercent', emoji: '💎', discount: 15, type: 'discount' },
  { id: 4, name: 'Бесплатная доставка', description: 'Бесплатная доставка заказа', cost: 150, icon: 'Truck', emoji: '🚚', type: 'bonus' },
  { id: 5, name: 'Подарок', description: 'Случайный подарок к заказу', cost: 250, icon: 'Gift', emoji: '🎁', type: 'gift' },
  { id: 6, name: 'VIP статус', description: 'Приоритетная поддержка на месяц', cost: 500, icon: 'Crown', emoji: '👑', type: 'bonus' }
];

const Index = () => {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [userPoints, setUserPoints] = useState(150);
  const [userName, setUserName] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isGameActive, setIsGameActive] = useState(false);
  const [gameScore, setGameScore] = useState(0);
  const [stars, setStars] = useState<Star[]>([]);
  const [gameTime, setGameTime] = useState(30);
  const [purchasedRewards, setPurchasedRewards] = useState<PurchasedReward[]>([]);
  const [isRewardsOpen, setIsRewardsOpen] = useState(false);

  useEffect(() => {
    if (isGameActive && gameTime > 0) {
      const timer = setTimeout(() => setGameTime(gameTime - 1), 1000);
      return () => clearTimeout(timer);
    } else if (gameTime === 0 && isGameActive) {
      endGame();
    }
  }, [isGameActive, gameTime]);

  useEffect(() => {
    if (isGameActive) {
      const interval = setInterval(() => {
        setStars(prevStars => {
          const newStars = prevStars
            .map(star => ({ ...star, y: star.y + star.speed }))
            .filter(star => star.y < 400);
          
          if (Math.random() < 0.1 && newStars.length < 8) {
            newStars.push({
              id: Date.now(),
              x: Math.random() * 350,
              y: 0,
              speed: 2 + Math.random() * 3
            });
          }
          return newStars;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isGameActive]);

  const startGame = () => {
    setIsGameActive(true);
    setGameScore(0);
    setGameTime(30);
    setStars([]);
  };

  const endGame = () => {
    setIsGameActive(false);
    const earnedPoints = gameScore * 10;
    setUserPoints(prev => prev + earnedPoints);
    toast.success(`Игра окончена! Заработано ${earnedPoints} баллов 🎉`);
  };

  const catchStar = (starId: number) => {
    setStars(prev => prev.filter(s => s.id !== starId));
    setGameScore(prev => prev + 1);
  };

  const submitReview = () => {
    if (!userName.trim() || !reviewText.trim() || rating === 0) {
      toast.error('Заполните все поля и поставьте оценку');
      return;
    }

    const newReview: Review = {
      id: Date.now(),
      author: userName,
      date: 'Только что',
      text: reviewText,
      rating: rating,
      likes: 0,
      verified: false
    };

    setReviews([newReview, ...reviews]);
    setUserPoints(prev => prev + 50);
    toast.success('Отзыв добавлен! +50 баллов 🌟');
    
    setUserName('');
    setReviewText('');
    setRating(0);
  };

  const renderStars = (currentRating: number, interactive = false, size = 5) => {
    const stars = [];
    const displayRating = interactive ? (hoverRating || rating) : currentRating;
    
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <button
          key={i}
          type="button"
          disabled={!interactive}
          onMouseEnter={() => interactive && setHoverRating(i)}
          onMouseLeave={() => interactive && setHoverRating(0)}
          onClick={() => interactive && setRating(i)}
          className={`${interactive ? 'cursor-pointer hover:scale-125 transition-transform' : ''}`}
        >
          <Icon 
            name="Star" 
            className={`w-${size} h-${size} ${i <= displayRating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'} transition-colors`}
          />
        </button>
      );
    }
    return stars;
  };

  const likeReview = (id: number) => {
    setReviews(reviews.map(r => 
      r.id === id ? { ...r, likes: r.likes + 1 } : r
    ));
    setUserPoints(prev => prev + 5);
    toast.success('+5 баллов за лайк!');
  };

  const purchaseReward = (reward: Reward) => {
    if (userPoints < reward.cost) {
      toast.error('Недостаточно баллов!');
      return;
    }

    const code = `${reward.name.toUpperCase().replace(/\s/g, '')}-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
    const newPurchase: PurchasedReward = {
      id: Date.now(),
      rewardId: reward.id,
      reward: reward,
      purchasedAt: new Date().toLocaleString('ru-RU'),
      used: false,
      code: code
    };

    setPurchasedRewards([newPurchase, ...purchasedRewards]);
    setUserPoints(prev => prev - reward.cost);
    toast.success(`${reward.emoji} ${reward.name} куплен! Код: ${code}`);
  };

  const useReward = (id: number) => {
    setPurchasedRewards(purchasedRewards.map(r => 
      r.id === id ? { ...r, used: true } : r
    ));
    toast.success('Награда использована! ✅');
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  const userLevel = Math.floor(userPoints / 100) + 1;
  const progressToNextLevel = (userPoints % 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 pb-20 md:pb-8">
      <div className="container mx-auto px-4 py-4 md:py-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6 md:mb-8 animate-fade-in">
          <div>
            <h1 className="text-3xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Мой Магазин
            </h1>
            <p className="text-base md:text-lg text-muted-foreground">Оставьте отзыв и заработайте баллы!</p>
          </div>
          
          <Card className="backdrop-blur-sm bg-white/90 border-2 border-primary/20 w-full md:min-w-[280px] md:max-w-[320px]">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Icon name="Trophy" className="w-5 h-5 text-amber-500" />
                Ваш профиль
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Баллы:</span>
                <Badge variant="default" className="text-lg px-3">
                  <Icon name="Star" className="w-4 h-4 mr-1 fill-white" />
                  {userPoints}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Уровень {userLevel}</span>
                  <span className="text-muted-foreground">{progressToNextLevel}/100</span>
                </div>
                <Progress value={progressToNextLevel} className="h-2" />
              </div>
              <div className="grid grid-cols-3 gap-2 pt-2 border-t">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{reviews.length}</div>
                  <div className="text-xs text-muted-foreground">Отзывов</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary">{averageRating}</div>
                  <div className="text-xs text-muted-foreground">Рейтинг</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">{userLevel}</div>
                  <div className="text-xs text-muted-foreground">Уровень</div>
                </div>
              </div>
              <Button 
                onClick={() => setIsRewardsOpen(true)}
                className="w-full mt-4 gap-2"
                variant="default"
              >
                <Icon name="Gift" className="w-4 h-4" />
                Магазин наград
              </Button>
            </CardContent>
          </Card>
        </div>

        <Dialog open={isRewardsOpen} onOpenChange={setIsRewardsOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto w-[95vw] md:w-full">
            <DialogHeader>
              <DialogTitle className="text-3xl flex items-center gap-2">
                <Icon name="Store" className="w-8 h-8 text-primary" />
                Магазин наград
              </DialogTitle>
              <DialogDescription>
                Обменивайте накопленные баллы на скидки и бонусы
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="shop" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="shop" className="gap-2">
                  <Icon name="ShoppingCart" className="w-4 h-4" />
                  Каталог наград
                </TabsTrigger>
                <TabsTrigger value="purchased" className="gap-2">
                  <Icon name="Package" className="w-4 h-4" />
                  Мои награды ({purchasedRewards.length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="shop" className="mt-6">
                <div className="grid md:grid-cols-2 gap-4">
                  {rewards.map((reward) => (
                    <Card key={reward.id} className="border-2 hover:shadow-lg transition-all hover:-translate-y-1">
                      <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="text-4xl">{reward.emoji}</div>
                            <div>
                              <CardTitle className="text-lg">{reward.name}</CardTitle>
                              <CardDescription>{reward.description}</CardDescription>
                            </div>
                          </div>
                          {reward.discount && (
                            <Badge variant="secondary" className="text-lg">
                              -{reward.discount}%
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Icon name="Star" className="w-5 h-5 fill-amber-400 text-amber-400" />
                            <span className="text-2xl font-bold text-primary">{reward.cost}</span>
                            <span className="text-muted-foreground">баллов</span>
                          </div>
                          <Button 
                            onClick={() => purchaseReward(reward)}
                            disabled={userPoints < reward.cost}
                            className="gap-2"
                          >
                            <Icon name="ShoppingBag" className="w-4 h-4" />
                            Купить
                          </Button>
                        </div>
                        {userPoints < reward.cost && (
                          <p className="text-sm text-destructive mt-2">
                            Не хватает {reward.cost - userPoints} баллов
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="purchased" className="mt-6">
                {purchasedRewards.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🎁</div>
                    <h3 className="text-xl font-semibold mb-2">У вас пока нет наград</h3>
                    <p className="text-muted-foreground mb-4">Купите награды в каталоге</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {purchasedRewards.map((purchase) => (
                      <Card key={purchase.id} className={`border-2 ${purchase.used ? 'opacity-60' : ''}`}>
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-4 flex-1">
                              <div className="text-5xl">{purchase.reward.emoji}</div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="text-xl font-bold">{purchase.reward.name}</h3>
                                  {purchase.used && (
                                    <Badge variant="secondary">Использовано</Badge>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">
                                  {purchase.reward.description}
                                </p>
                                <div className="flex items-center gap-4 text-sm">
                                  <div className="flex items-center gap-1">
                                    <Icon name="Calendar" className="w-4 h-4" />
                                    <span>{purchase.purchasedAt}</span>
                                  </div>
                                  {purchase.code && (
                                    <div className="flex items-center gap-1">
                                      <Icon name="Ticket" className="w-4 h-4" />
                                      <code className="bg-muted px-2 py-1 rounded font-mono">
                                        {purchase.code}
                                      </code>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            {!purchase.used && (
                              <Button 
                                onClick={() => useReward(purchase.id)}
                                variant="default"
                                className="gap-2"
                              >
                                <Icon name="Check" className="w-4 h-4" />
                                Использовать
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>

        <div className="grid md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
          <Card className="backdrop-blur-sm bg-white/90 border-2 hover:shadow-xl transition-all animate-scale-in">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
              <CardTitle className="flex items-center gap-2">
                <Icon name="PenLine" className="w-5 h-5" />
                Написать отзыв
              </CardTitle>
              <CardDescription>Поделитесь впечатлениями и получите 50 баллов!</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Ваше имя</label>
                <Input
                  placeholder="Введите имя"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="border-2"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Ваша оценка</label>
                <div className="flex gap-2">
                  {renderStars(rating, true, 8)}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Ваш отзыв</label>
                <Textarea
                  placeholder="Расскажите о своём опыте..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="min-h-[120px] border-2"
                />
              </div>
              <Button 
                onClick={submitReview}
                className="w-full h-12 text-lg gap-2"
                size="lg"
              >
                <Icon name="Send" className="w-5 h-5" />
                Отправить отзыв (+50 баллов)
              </Button>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-gradient-to-br from-accent/20 to-secondary/20 border-2 border-accent hover:shadow-xl transition-all animate-scale-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="Gamepad2" className="w-5 h-5" />
                Мини-игра: Поймай звезду! ⭐
              </CardTitle>
              <CardDescription>Ловите падающие звёзды и зарабатывайте баллы</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isGameActive ? (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">🎮</div>
                  <p className="text-lg mb-2">Нажимайте на падающие звёзды!</p>
                  <p className="text-sm text-muted-foreground mb-6">Каждая звезда = 10 баллов</p>
                  <Button 
                    onClick={startGame}
                    size="lg"
                    className="gap-2"
                  >
                    <Icon name="Play" className="w-5 h-5" />
                    Начать игру
                  </Button>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between mb-4">
                    <Badge variant="default" className="text-lg px-4 py-2">
                      <Icon name="Star" className="w-4 h-4 mr-2 fill-white" />
                      Счёт: {gameScore}
                    </Badge>
                    <Badge variant="secondary" className="text-lg px-4 py-2">
                      <Icon name="Clock" className="w-4 h-4 mr-2" />
                      {gameTime}s
                    </Badge>
                  </div>
                  <div className="relative h-[300px] md:h-[400px] bg-gradient-to-b from-indigo-900 to-purple-900 rounded-lg overflow-hidden border-4 border-primary">
                    {stars.map(star => (
                      <button
                        key={star.id}
                        onClick={() => catchStar(star.id)}
                        className="absolute text-4xl cursor-pointer hover:scale-125 transition-transform animate-pulse"
                        style={{ left: `${star.x}px`, top: `${star.y}px` }}
                      >
                        ⭐
                      </button>
                    ))}
                    {stars.length === 0 && gameTime > 25 && (
                      <div className="absolute inset-0 flex items-center justify-center text-white/50 text-lg">
                        Ждите звёзды...
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mb-4 md:mb-6 animate-fade-in">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Все отзывы ({reviews.length})</h2>
          <div className="flex items-center gap-2">
            <div className="flex">{renderStars(parseFloat(averageRating))}</div>
            <span className="text-lg md:text-xl font-semibold">{averageRating}</span>
            <span className="text-sm md:text-base text-muted-foreground">из 5</span>
          </div>
        </div>

        <div className="grid gap-4 md:gap-6 md:grid-cols-2">
          {reviews.map((review, index) => (
            <Card 
              key={review.id}
              className="overflow-hidden transition-all hover:shadow-2xl hover:-translate-y-1 animate-fade-in backdrop-blur-sm bg-white/90 border-2"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12 border-2 border-primary">
                      <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white font-bold">
                        {review.author.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold flex items-center gap-2">
                        {review.author}
                        {review.verified && (
                          <Badge variant="default" className="text-xs gap-1">
                            <Icon name="BadgeCheck" className="w-3 h-3" />
                            Проверен
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">{review.date}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary mb-1">{review.rating}.0</div>
                    <div className="flex gap-0.5">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-base leading-relaxed mb-4">{review.text}</p>
                <div className="flex items-center justify-between pt-4 border-t">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="gap-2 hover:text-primary"
                    onClick={() => likeReview(review.id)}
                  >
                    <Icon name="ThumbsUp" className="w-4 h-4" />
                    Полезно ({review.likes})
                  </Button>
                  <Button variant="ghost" size="sm" className="gap-2 hover:text-primary">
                    <Icon name="Share2" className="w-4 h-4" />
                    Поделиться
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;