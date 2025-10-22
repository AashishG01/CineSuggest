import HeroBanner from '../components/HeroBanner';
import MovieRow from '../components/MovieRow';
// CHANGE: The old 'requests.js' import is no longer needed.

const HomePage = () => {
  return (
    // DESIGN CHANGE: Switched from hardcoded black to our new theme-aware background.
    <main className="bg-white dark:bg-slate-950">
      <HeroBanner />

      {/* This container pulls the rows up over the HeroBanner's bottom gradient */}
      <div className="relative z-10 -mt-20 md:-mt-32 px-6 md:px-12 pb-20 space-y-12">
        {/* CHANGE: Replaced the 'fetchUrl' prop with the new, simpler 'category' prop. */}
        <MovieRow title="Trending Now" category="popular" />
        <MovieRow title="Top Rated Movies" category="best" />
        {/* --- Add Bollywood/Indian Rows Here --- */}
        {/* <MovieRow title="Bollywood Hits" category="bollywood" /> 
        <MovieRow title="Indian Cinema" category="indian" />  */}
        {/* You could also try specific Indian genres */}
        {/* <MovieRow title="Hindi Action" category="hindi action" /> */}
        <MovieRow title="Action Blockbusters" category="action" />
        <MovieRow title="Laugh Out Loud Comedies" category="comedy" />
        <MovieRow title="Spine-Chilling Horrors" category="horror" />
        {/* You can continue adding as many rows with different categories as you like */}
      </div>
    </main>
  );
};

export default HomePage;