import AspectRatio from '@mui/joy/AspectRatio';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import CardOverflow from '@mui/joy/CardOverflow';
import Divider from '@mui/joy/Divider';
import Typography from '@mui/joy/Typography';
import heroImage from '@/assets/images/hero.jpg';

export const Results = () => {
  return (
    <div>
      <Typography level="h2" component="h1" mb={2}>
        Completed evaluations
      </Typography>
      <Divider />
      <div className="mt-4">
        <Card variant="outlined" sx={{ width: 320, cursor: 'pointer' }}>
          <CardOverflow>
            <AspectRatio ratio="2">
              <img src={heroImage} srcSet={heroImage} loading="lazy" alt="" />
            </AspectRatio>
          </CardOverflow>
          <CardContent>
            <Typography level="title-md">Comprehensive Post-Traumatic Stress Disorder Evaluation</Typography>
          </CardContent>
          <CardOverflow variant="soft" sx={{ bgcolor: 'background.level1' }}>
            <Divider inset="context" />
            <CardContent orientation="horizontal">
              <Typography level="body-xs" fontWeight="md" textColor="text.secondary">
                April 24, 2024 12:33 PM
              </Typography>
            </CardContent>
          </CardOverflow>
        </Card>
      </div>
    </div>
  );
};
