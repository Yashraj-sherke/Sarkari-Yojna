import os

marquee_css = """
/* Marquee styles */
.marquee-container {
  overflow: hidden;
  white-space: nowrap;
  box-sizing: border-box;
  width: 100%;
  display: flex;
  align-items: center;
  background: #fff;
  padding: 12px 15px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  margin-bottom: 30px;
}

.marquee-content {
  display: inline-block;
  padding-left: 100%;
  animation: marquee 25s linear infinite;
}

.marquee-content:hover {
  animation-play-state: paused;
}

.marquee-item {
  display: inline-flex;
  align-items: center;
  margin-right: 40px;
  font-size: 1.05rem;
  font-weight: 600;
  color: #2d3748;
  text-decoration: none;
}
.marquee-item:hover {
  text-decoration: underline;
  color: #3182ce;
}
.marquee-date {
  background: #e2e8f0;
  color: #4a5568;
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  margin-right: 12px;
  font-weight: 700;
}

@keyframes marquee {
  0%   { transform: translate(0, 0); }
  100% { transform: translate(-100%, 0); }
}
"""

path = 'app/globals.css'
with open(path, 'a', encoding='utf-8') as f:
    f.write(marquee_css)
print("CSS appended.")
