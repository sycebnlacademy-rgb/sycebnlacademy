import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ReactMarkdown from 'react-markdown';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const SlideShow = ({ content, title, onComplete }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [swiper, setSwiper] = useState(null);
  const [slides, setSlides] = useState([]);

  // Diviser le contenu en slides basé sur les titres et paragraphes
  useEffect(() => {
    const parseContentToSlides = (content) => {
      const lines = content.split('\n').filter(line => line.trim() !== '');
      const slideData = [];
      let currentSlide = { title: '', content: '', type: 'content' };
      
      // Slide de titre principal
      const titleMatch = content.match(/^# (.+)/m);
      if (titleMatch) {
        slideData.push({
          title: titleMatch[1],
          content: '',
          type: 'title'
        });
      }
      
      let currentSection = '';
      let currentSubsection = '';
      let currentContent = [];
      
      lines.forEach((line, index) => {
        const trimmedLine = line.trim();
        
        if (trimmedLine.startsWith('## ')) {
          // Nouveau slide pour chaque H2
          if (currentSection && currentContent.length > 0) {
            slideData.push({
              title: currentSection,
              content: currentContent.join('\n'),
              type: 'section'
            });
          }
          
          currentSection = trimmedLine.replace('## ', '');
          currentSubsection = '';
          currentContent = [];
          
        } else if (trimmedLine.startsWith('### ')) {
          // Nouveau slide pour chaque H3
          if (currentSubsection && currentContent.length > 0) {
            slideData.push({
              title: currentSubsection,
              content: currentContent.join('\n'),
              type: 'subsection'
            });
          }
          
          currentSubsection = trimmedLine.replace('### ', '');
          currentContent = [];
          
        } else if (trimmedLine.startsWith('# ')) {
          // Ignorer les titres H1 car déjà traités
          return;
          
        } else if (trimmedLine !== '') {
          // Contenu normal
          currentContent.push(trimmedLine);
        }
      });
      
      // Ajouter le dernier slide
      if (currentSubsection && currentContent.length > 0) {
        slideData.push({
          title: currentSubsection,
          content: currentContent.join('\n'),
          type: 'subsection'
        });
      } else if (currentSection && currentContent.length > 0) {
        slideData.push({
          title: currentSection,
          content: currentContent.join('\n'),
          type: 'section'
        });
      }
      
      // Si pas de structure claire, diviser par paragraphes
      if (slideData.length <= 1) {
        const paragraphs = content.split('\n\n').filter(p => p.trim() !== '');
        paragraphs.forEach((paragraph, index) => {
          if (paragraph.trim() !== '' && !paragraph.startsWith('# ')) {
            const lines = paragraph.split('\n');
            const firstLine = lines[0].trim();
            
            if (firstLine.startsWith('## ') || firstLine.startsWith('### ')) {
              slideData.push({
                title: firstLine.replace(/#{2,3} /, ''),
                content: lines.slice(1).join('\n'),
                type: firstLine.startsWith('## ') ? 'section' : 'subsection'
              });
            } else {
              slideData.push({
                title: `Slide ${index + 1}`,
                content: paragraph,
                type: 'content'
              });
            }
          }
        });
      }
      
      return slideData.filter(slide => slide.title || slide.content);
    };

    const parsedSlides = parseContentToSlides(content);
    setSlides(parsedSlides);
  }, [content]);

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8
    })
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const handleSlideChange = (swiper) => {
    setCurrentSlide(swiper.activeIndex);
  };

  const toggleAutoplay = () => {
    if (swiper) {
      if (isPlaying) {
        swiper.autoplay.stop();
      } else {
        swiper.autoplay.start();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const resetSlideshow = () => {
    if (swiper) {
      swiper.slideTo(0);
      swiper.autoplay.stop();
      setIsPlaying(false);
      setCurrentSlide(0);
    }
  };

  const renderSlideContent = (slide, index) => {
    const getSlideBackground = (type) => {
      switch (type) {
        case 'title':
          return 'bg-gradient-to-br from-blue-600 to-blue-800 text-white';
        case 'section':
          return 'bg-gradient-to-br from-indigo-50 to-blue-50';
        case 'subsection':
          return 'bg-gradient-to-br from-gray-50 to-gray-100';
        default:
          return 'bg-white';
      }
    };

    const getTextColor = (type) => {
      return type === 'title' ? 'text-white' : 'text-gray-900';
    };

    return (
      <motion.div
        key={index}
        className={`h-full w-full p-8 flex flex-col justify-center ${getSlideBackground(slide.type)}`}
        variants={textVariants}
        initial="hidden"
        animate="visible"
      >
        {slide.type === 'title' ? (
          <div className="text-center">
            <motion.h1 
              className="text-4xl md:text-6xl font-bold mb-6"
              variants={itemVariants}
            >
              {slide.title}
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl opacity-90"
              variants={itemVariants}
            >
              {title}
            </motion.p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <motion.h2 
              className={`${
                slide.type === 'section' 
                  ? 'text-3xl md:text-4xl' 
                  : 'text-2xl md:text-3xl'
              } font-bold mb-8 ${getTextColor(slide.type)}`}
              variants={itemVariants}
            >
              {slide.title}
            </motion.h2>
            <motion.div 
              className={`prose prose-lg max-w-none ${getTextColor(slide.type)}`}
              variants={itemVariants}
            >
              <ReactMarkdown>{slide.content}</ReactMarkdown>
            </motion.div>
          </div>
        )}
      </motion.div>
    );
  };

  if (slides.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[600px] bg-gray-900 rounded-xl overflow-hidden shadow-2xl">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        spaceBetween={0}
        slidesPerView={1}
        navigation={{
          prevEl: '.swiper-button-prev-custom',
          nextEl: '.swiper-button-next-custom',
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        autoplay={{
          delay: 8000,
          disableOnInteraction: false,
        }}
        effect="fade"
        fadeEffect={{
          crossFade: true
        }}
        onSwiper={setSwiper}
        onSlideChange={handleSlideChange}
        className="h-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            {renderSlideContent(slide, index)}
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation */}
      <div className="absolute top-1/2 left-4 transform -translate-y-1/2 z-10">
        <Button
          variant="outline"
          size="icon"
          className="swiper-button-prev-custom bg-white/90 hover:bg-white border-0 shadow-lg"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
      </div>

      <div className="absolute top-1/2 right-4 transform -translate-y-1/2 z-10">
        <Button
          variant="outline"
          size="icon"
          className="swiper-button-next-custom bg-white/90 hover:bg-white border-0 shadow-lg"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      {/* Controls */}
      <div className="absolute bottom-4 left-4 flex items-center space-x-2 z-10">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleAutoplay}
          className="bg-white/90 hover:bg-white border-0 shadow-lg"
        >
          {isPlaying ? (
            <Pause className="w-4 h-4 mr-2" />
          ) : (
            <Play className="w-4 h-4 mr-2" />
          )}
          {isPlaying ? 'Pause' : 'Play'}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={resetSlideshow}
          className="bg-white/90 hover:bg-white border-0 shadow-lg"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Recommencer
        </Button>
      </div>

      {/* Progress indicator */}
      <div className="absolute bottom-4 right-4 z-10">
        <div className="bg-white/90 rounded-full px-3 py-1 text-sm font-medium shadow-lg">
          {currentSlide + 1} / {slides.length}
        </div>
      </div>

      {/* Completion button */}
      {currentSlide === slides.length - 1 && onComplete && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-16 left-1/2 transform -translate-x-1/2 z-10"
        >
          <Button
            onClick={onComplete}
            className="bg-green-600 hover:bg-green-700 text-white shadow-lg"
          >
            Terminer le diaporama
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default SlideShow;

