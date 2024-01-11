module default {
  type Region {
    required key: str { constraint exclusive };
    required x: int64;
    required y: int64;
    open: bool;
    odds: int16;
    digs: json;
    posts: json;   
  }
};
