import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Profile = () => {
  const [userPoints] = useState(150);
  const [totalReviews] = useState(2);
  const [totalLikes] = useState(70);
  const [gamesPlayed] = useState(5);

  const userLevel = Math.floor(userPoints / 100) + 1;
  const progressToNextLevel = (userPoints % 100);

  const achievements = [
    { id: 1, name: 'Первый отзыв', emoji: '✍️', description: 'Написали первый отзыв', unlocked: true },
    { id: 2, name: 'Игрок', emoji: '🎮', description: 'Сыграли в мини-игру 5 раз', unlocked: true },
    { id: 3, name: 'Популярный', emoji: '👍', description: 'Получили 50 лайков', unlocked: true },
    { id: 4, name: 'Критик', emoji: '⭐', description: 'Написали 10 отзывов', unlocked: false },
    { id: 5, name: 'Миллионер', emoji: '💎', description: 'Накопили 1000 баллов', unlocked: false },
    { id: 6, name: 'VIP', emoji: '👑', description: 'Достигли 10 уровня', unlocked: false }
  ];

  const stats = [
    { label: 'Отзывов написано', value: totalReviews, icon: 'PenLine', color: 'text-primary' },
    { label: 'Лайков получено', value: totalLikes, icon: 'ThumbsUp', color: 'text-secondary' },
    { label: 'Игр сыграно', value: gamesPlayed, icon: 'Gamepad2', color: 'text-accent' },
    { label: 'Всего баллов', value: userPoints, icon: 'Star', color: 'text-amber-500' }
  ];

  const history = [
    { id: 1, action: 'Написал отзыв', points: '+50', time: '2 часа назад', icon: 'PenLine' },
    { id: 2, action: 'Сыграл в мини-игру', points: '+80', time: '5 часов назад', icon: 'Gamepad2' },
    { id: 3, action: 'Поставил лайк', points: '+5', time: '1 день назад', icon: 'ThumbsUp' },
    { id: 4, action: 'Написал отзыв', points: '+50', time: '2 дня назад', icon: 'PenLine' },
    { id: 5, action: 'Купил награду: Скидка 10%', points: '-200', time: '3 дня назад', icon: 'ShoppingBag' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 pb-20 md:pb-8">
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="mb-6 md:mb-8 animate-fade-in">
          <h1 className="text-3xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Личный профиль
          </h1>
          <p className="text-base md:text-lg text-muted-foreground">Ваша статистика и достижения</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
          <Card className="md:col-span-2 backdrop-blur-sm bg-white/90 border-2 animate-scale-in">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16 md:w-20 md:h-20 border-4 border-primary">
                  <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-2xl md:text-3xl font-bold">
                    П
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-xl md:text-2xl mb-1">Пользователь</CardTitle>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="default" className="gap-1">
                      <Icon name="Trophy" className="w-3 h-3" />
                      Уровень {userLevel}
                    </Badge>
                    <Badge variant="secondary" className="gap-1">
                      <Icon name="Star" className="w-3 h-3 fill-amber-400" />
                      {userPoints} баллов
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Прогресс до уровня {userLevel + 1}</span>
                  <span className="text-muted-foreground">{progressToNextLevel}/100</span>
                </div>
                <Progress value={progressToNextLevel} className="h-3" />
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-gradient-to-br from-accent/20 to-secondary/20 border-2 border-accent animate-scale-in">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl flex items-center gap-2">
                <Icon name="Award" className="w-5 h-5" />
                Достижения
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-primary mb-1">
                  {achievements.filter(a => a.unlocked).length}/{achievements.length}
                </div>
                <p className="text-sm text-muted-foreground">Разблокировано</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
          {stats.map((stat, index) => (
            <Card 
              key={stat.label} 
              className="backdrop-blur-sm bg-white/90 border-2 hover:shadow-lg transition-all animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="pt-4 md:pt-6 text-center">
                <Icon name={stat.icon} className={`w-8 h-8 md:w-10 md:h-10 mx-auto mb-2 ${stat.color}`} />
                <div className="text-2xl md:text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-xs md:text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="achievements" className="animate-fade-in">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="achievements" className="gap-2">
              <Icon name="Award" className="w-4 h-4" />
              <span className="hidden sm:inline">Достижения</span>
              <span className="sm:hidden">Награды</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <Icon name="History" className="w-4 h-4" />
              История
            </TabsTrigger>
          </TabsList>

          <TabsContent value="achievements">
            <div className="grid md:grid-cols-2 gap-4">
              {achievements.map((achievement) => (
                <Card 
                  key={achievement.id} 
                  className={`border-2 transition-all ${achievement.unlocked ? 'bg-white/90' : 'bg-gray-100/50 opacity-60'}`}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className={`text-4xl md:text-5xl ${!achievement.unlocked && 'grayscale'}`}>
                        {achievement.emoji}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-base md:text-lg">{achievement.name}</h3>
                          {achievement.unlocked && (
                            <Badge variant="default" className="text-xs">
                              <Icon name="Check" className="w-3 h-3" />
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="history">
            <Card className="backdrop-blur-sm bg-white/90 border-2">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {history.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 pb-4 border-b last:border-0">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center flex-shrink-0">
                        <Icon name={item.icon} className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm md:text-base truncate">{item.action}</div>
                        <div className="text-xs md:text-sm text-muted-foreground">{item.time}</div>
                      </div>
                      <Badge 
                        variant={item.points.startsWith('+') ? 'default' : 'secondary'}
                        className="text-sm md:text-base px-2 md:px-3 flex-shrink-0"
                      >
                        {item.points}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
