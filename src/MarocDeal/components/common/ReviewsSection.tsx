/**
 * ReviewsSection Component
 * 
 * Place this component directly above Footer in App.tsx or your main layout component.
 * 
 * Props:
 * - isLoggedIn: boolean - Whether user is authenticated
 * - currentUserName: string - Name of current logged-in user  
 * - onRequireAuth: (action: 'login' | 'register') => void - Callback when auth is required
 * - onSubmitReview: (review: ReviewData) => Promise<void> - Callback to submit review
 * - allowAssistantRate: boolean - Show demo rate button for testing
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Star, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
  avatar?: string;
}
interface ReviewData {
  rating: number;
  comment: string;
}
interface Props {
  isLoggedIn: boolean;
  currentUserName: string;
  onRequireAuth: (action: 'login' | 'register') => void;
  onSubmitReview: (review: ReviewData) => Promise<void>;
  allowAssistantRate?: boolean;
}
const sampleReviews: Review[] = [{
  id: '1',
  name: 'أحمد محمد',
  rating: 5,
  comment: 'موقع ممتاز! وجدت كل ما أحتاجه بأسعار رائعة. التوصيل سريع والخدمة مميزة.',
  date: '2024-01-15'
}, {
  id: '2',
  name: 'فاطمة الزهراء',
  rating: 4,
  comment: 'تجربة تسوق جيدة جداً. المنتجات بجودة عالية وخدمة العملاء متجاوبة.',
  date: '2024-01-10'
}, {
  id: '3',
  name: 'يوسف العلوي',
  rating: 5,
  comment: 'أفضل موقع للتسوق الإلكتروني في المغرب. أنصح به بشدة!',
  date: '2024-01-08'
}];
const StarRating: React.FC<{
  rating: number;
  interactive?: boolean;
  onChange?: (rating: number) => void;
}> = ({
  rating,
  interactive = false,
  onChange
}) => {
  const [hoverRating, setHoverRating] = useState(0);
  return <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(star => <Star key={star} className={`w-5 h-5 ${interactive ? 'cursor-pointer transition-colors hover:text-yellow-400' : ''} ${star <= (interactive ? hoverRating || rating : rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} onClick={interactive ? () => onChange?.(star) : undefined} onMouseEnter={interactive ? () => setHoverRating(star) : undefined} onMouseLeave={interactive ? () => setHoverRating(0) : undefined} />)}
    </div>;
};
const ReviewCard: React.FC<{
  review: Review;
}> = ({
  review
}) => {
  return <Card className="p-6 space-y-4">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          {review.avatar ? <img src={review.avatar} alt={review.name} className="w-full h-full rounded-full object-cover" /> : <User className="w-6 h-6 text-primary" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h4 className="font-semibold text-foreground">{review.name}</h4>
            <div className="flex items-center gap-2">
              <StarRating rating={review.rating} />
              <span className="text-sm text-muted-foreground">({review.rating}/5)</span>
            </div>
          </div>
          <p className="text-muted-foreground mb-2 leading-relaxed">{review.comment}</p>
          <time className="text-xs text-muted-foreground">
            {new Date(review.date).toLocaleDateString('ar-MA')}
          </time>
        </div>
      </div>
    </Card>;
};
export const ReviewsSection: React.FC<Props> = ({
  isLoggedIn,
  currentUserName,
  onRequireAuth,
  onSubmitReview,
  allowAssistantRate = false
}) => {
  const {
    t
  } = useTranslation();
  const {
    toast
  } = useToast();
  const [reviews, setReviews] = useState<Review[]>(sampleReviews);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast({
        title: 'خطأ',
        description: 'يرجى اختيار تقييم',
        variant: 'destructive'
      });
      return;
    }
    if (!comment.trim()) {
      toast({
        title: 'خطأ',
        description: 'يرجى كتابة تعليق',
        variant: 'destructive'
      });
      return;
    }
    if (comment.length > 500) {
      toast({
        title: 'خطأ',
        description: 'التعليق طويل جداً (500 حرف كحد أقصى)',
        variant: 'destructive'
      });
      return;
    }
    setIsSubmitting(true);
    try {
      // Optimistic UI - add review immediately
      const newReview: Review = {
        id: Date.now().toString(),
        name: currentUserName,
        rating,
        comment: comment.trim(),
        date: new Date().toISOString().split('T')[0]
      };
      setReviews(prev => [newReview, ...prev]);
      setRating(0);
      setComment('');
      await onSubmitReview({
        rating,
        comment: comment.trim()
      });
      toast({
        title: 'تم بنجاح!',
        description: 'تم إضافة تقييمك بنجاح'
      });
    } catch (error) {
      // Remove optimistic review on error
      setReviews(prev => prev.filter(r => r.id !== Date.now().toString()));
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء إضافة التقييم. حاول مرة أخرى.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleDemoRate = () => {
    const demoReview: Review = {
      id: `demo-${Date.now()}`,
      name: 'Buddy (Assistant)',
      rating: 5,
      comment: 'Great experience! The website is user-friendly and the service is excellent. Highly recommended for online shopping in Morocco.',
      date: new Date().toISOString().split('T')[0]
    };
    setReviews(prev => [demoReview, ...prev]);
    toast({
      title: 'Demo Review Added',
      description: 'A demo review has been added for testing purposes.'
    });
  };
  return <section className="py-16 bg-gradient-card">
      
    </section>;
};