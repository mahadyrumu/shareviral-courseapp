import { Model } from '@nozbe/watermelondb';
import { field, text, json, readonly, date } from '@nozbe/watermelondb/decorators';

const sanitizeTags = (rawTags: any) => {
  return Array.isArray(rawTags) ? rawTags : [];
};

export default class Course extends Model {
  static table = 'courses';

  @text('course_id') course_id: string;
  @text('title') title: string;
  @text('description_short') description_short: string;
  @text('instructor_id') instructor_id: string | null;
  @text('instructor_name') instructor_name: string;
  @text('instructor_expertise_level') instructor_expertise_level: string | null;
  @field('duration_weeks') duration_weeks: number;
  @field('price_usd') price_usd: number;
  @field('is_premium') is_premium: boolean;
  @json('tags', sanitizeTags) tags: string[];
  @field('rating') rating: number;
  @date('last_updated') last_updated: Date;
  @field('is_enrolled') is_enrolled: boolean;
}
