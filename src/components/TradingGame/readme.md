TradingGame.tsx (Main component)
Responsibility: The main component that manages all game logic.
Main states:
currentToken - current trading pair
chartType - type of chart (line/candles)
isGameStarted - game status
showPrediction - whether to show prediction buttons
showNextButton - whether to show the next game button
fullData - full chart data
visibleData - visible chart data
score - player's score
hasPredicted - whether the player has made a prediction
Main methods:
getRandomToken() - select a random trading pair
loadData() - load data from the Binance API
startGame() - start a new game
makePredict() - process the player's prediction
nextGame() - move to the next game


TradingControls.tsx (Control component)
Responsibility: Game control elements (selecting pair, chart type, starting the game).
Main props:
tradingPairs - list of available trading pairs
selectedPair - selected pair
onSelectPair - pair selection handler
chartType - type of chart
onChangeChartType - chart type change handler
onStartGame - game start handler
isGameStarted - game status
Control components:
Select - select trading pair
Button (Line/Candles) - switch chart type
Button (Start) - start the game


ChartComponent.tsx (Chart component)
Responsibility: Display and manage the chart using the lightweight-charts library.
Main props:
data - data to display
chartType - type of chart
width - width of the chart
height - height of the chart
Main logic:
Chart initialization
Managing data series (line/candle)
Updating data when the chart type changes
Transforming data for different chart types
Component interaction:
TradingGame manages game state and data
TradingControls provides the control interface
ChartComponent is responsible for visualizing data
This creates a clear separation of responsibilities:
Data and logic management (TradingGame)
User interface management (TradingControls)
Data visualization (ChartComponent)
