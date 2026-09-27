import React from 'react';
import { DemoCustomization } from '../../types';
import { FitnessTemplateView } from './FitnessTemplateView';
import { RestaurantTemplateView } from './RestaurantTemplateView';
import { EducationTemplateView } from './EducationTemplateView';

interface Props {
  data: DemoCustomization;
}

export const LiveTemplateRenderer: React.FC<Props> = ({ data }) => {
  if (data.templateId === 'restaurant') {
    return <RestaurantTemplateView data={data} />;
  }
  if (data.templateId === 'education') {
    return <EducationTemplateView data={data} />;
  }
  return <FitnessTemplateView data={data} />;
};
