WITH 
    coordinates := array_unpack(<array<tuple<int64, int64>>> $coordinates)
SELECT Region {
    x,
    y,
    posts
}
FILTER (.x, .y) IN coordinates;