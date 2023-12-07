CREATE MIGRATION m1tdoz4b4xrwicovxxjibrydke7jmirdtg4qiwdiyu464izkntgbga
    ONTO m1n4e5urun36iinllvpjy7xewsoc2qghwzdfi6kmj445ur4rqebuoq
{
  ALTER TYPE default::Region {
      CREATE PROPERTY posts: std::json;
  };
};
