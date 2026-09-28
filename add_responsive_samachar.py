import os

css = """
/* Samachar (News) Responsive Styles */
.samachar-main {
  padding: 2rem;
}
@media (max-width: 768px) {
  .samachar-main {
    padding: 1rem;
  }
}

.samachar-header-title {
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 1rem;
  color: #111;
}
@media (max-width: 768px) {
  .samachar-header-title {
    font-size: 1.5rem;
  }
}

.samachar-article-card {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
  background: white;
}
@media (max-width: 768px) {
  .samachar-article-card {
    padding: 15px;
  }
}

.samachar-detail-article {
  background: white;
  border-radius: 12px;
  padding: 30px;
  border: 1px solid #e2e8f0;
}
@media (max-width: 768px) {
  .samachar-detail-article {
    padding: 15px;
    border-radius: 8px;
  }
}

.samachar-detail-title {
  font-size: 2.2rem;
  font-weight: 800;
  margin-bottom: 20px;
  color: #111;
  line-height: 1.3;
}
@media (max-width: 768px) {
  .samachar-detail-title {
    font-size: 1.6rem;
    margin-bottom: 15px;
  }
}

.samachar-cover {
  position: relative;
  width: 100%;
  height: 400px;
  margin-bottom: 30px;
  border-radius: 12px;
  overflow: hidden;
}
@media (max-width: 768px) {
  .samachar-cover {
    height: 220px;
    margin-bottom: 20px;
    border-radius: 8px;
  }
}

.samachar-body p {
  margin-bottom: 20px;
}
@media (max-width: 768px) {
  .samachar-body p {
    font-size: 1rem;
    line-height: 1.6;
    margin-bottom: 15px;
  }
}
"""

path = 'app/globals.css'
with open(path, 'a', encoding='utf-8') as f:
    f.write(css)
print("CSS appended.")
