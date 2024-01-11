CREATE MIGRATION m1bqg4ewjsjbt2jekzpehed7yr4efhlrmapu6ezpwng4u4mzoeymga
    ONTO m1skdudszutcqkiaf2gateo3rbxy3febc2czcs2oydlp64vwjqizea
{
  ALTER TYPE default::Region {
      ALTER PROPERTY digs {
          SET TYPE std::json USING (<std::json>.digs);
      };
  };
};
