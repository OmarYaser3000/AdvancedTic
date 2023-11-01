export const panel = `
        <button class="settings-btn">
          <i class="fa-solid fa-gear"></i>
        </button>
        <div class="settings">
          <h2>Settings</h2>
          <form action="">
            <label for="letter">Choose Your Letter:</label>
            <select name="letter" id="letter">
              <option value="O">O</option>
              <option value="X">X</option>
            </select>
            <label for="opponent">Play Against:</label>
            <select name="opponent" id="opponent">
              <option value="comp">Computer</option>
              <option value="local">Local</option>
              <option value="online">Online</option>
            </select>
            <label for="compLevel">Computer Difficulty:</label>
            <select name="compLevel" id="compLevel">
              <option value="easy">Easy</option>
              <option value="medium">medium</option>
              <option value="hard">hard</option>
            </select>
            <label for="mode">Game Mode:</label>
            <select name="mode" id="mode">
              <option value="default">Default</option>
              <option value="quick">Quick</option>
              <option value="turnLimit">Turn Limit</option>
            </select>
            <label for="boardSize">Board Size:</label>
            <select name="boardSize" id="size">
              <option value="3">3x3</option>
              <option value="4">4x4</option>
            </select>
            <label for="theme">Game Theme:</label>
            <select name="theme" id="theme">
              <option value="theme01">Halloween Theme</option>
              <option value="theme02">Purple Theme</option>
              <option value="theme03">Green Theme</option>
              </select>
              </form>
              </div>
              `;
// <option value="theme04">Theme 04</option>
// <option value="theme05">Theme 05</option>
// <option value="theme06">Theme 06</option>
