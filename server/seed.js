import Database from "better-sqlite3";

const db = new Database('database.db');

//YOU MUST USE BACKTICKS
//INSIDE INTERNAL BRACKETS WE PUT THE ROWS/COLUMNS WE WANT
db.exec(`CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    message TEXT,
    username TEXT,
    imgURL TEXT
)`)


db.exec(`
INSERT INTO messages (message, username, imgURL) 
VALUES 
('I''m Batman', 'Batman', 'https://posters.movieposterdb.com/20_10/2012/848228/s_848228_9bc5bc2a.jpg'), 
('My Name is Jeff', 'Channing Tatum', 'https://posters.movieposterdb.com/21_01/1977/76759/s_76759_43e2730c.jpg')
`);
