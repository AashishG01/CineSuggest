# -------------------------------
# 📘 Required Libraries
# -------------------------------
from fastapi import FastAPI
from pydantic import BaseModel
import pandas as pd
import numpy as np
from sentence_transformers import SentenceTransformer
import faiss
import uvicorn

app = FastAPI(title="Movie Recommendation API")


print("Loading dataset and embeddings...")
movies = pd.read_pickle("movies_dataset.pkl")  # Preprocessed dataset
embeddings = np.load("movie_embeddings.npy")   # Precomputed Sentence-BERT embeddings

dimension = embeddings.shape[1]
index = faiss.IndexFlatL2(dimension)
index.add(embeddings)
print(f"FAISS index loaded with {index.ntotal} movies.")

class MovieInput(BaseModel):
    imdb_ids: list  # list of IMDb IDs
    top_n: int = 10  # number of recommendations


def recommend_from_imdb_ids(input_ids, top_n=10):
    """
    Input: list of IMDb IDs
    Output: list of recommended IMDb IDs
    """
    print(f"--- Python Service Received: {input_ids} ---")
    # Find indices of input movies
    movie_indices = []
    input_lower = [str(i).lower() for i in input_ids]
    for imdb in input_ids:
        row = movies[movies['imdb_id'].str.lower() == str(imdb).lower()]
        if not row.empty:
            movie_indices.append(row.index[0])
    
    if not movie_indices:
        return {"error": "None of the input IMDb IDs found in dataset"}
    
    # Get embeddings for input movies
    vectors = embeddings[movie_indices]
    
    # Combine embeddings (average)
    user_vector = np.mean(vectors, axis=0).reshape(1, -1)
    
    # Query FAISS for more than top_n to account for skips
    distances, indices = index.search(user_vector, top_n + len(input_ids) + 10)
    
    recommended_ids = []
    for i in indices[0]:
        imdb_id = movies.iloc[i]['imdb_id']
        # Skip if missing or in input
        if pd.notna(imdb_id) and imdb_id.strip() != "" and imdb_id.lower() not in input_lower:
            recommended_ids.append(imdb_id)
        if len(recommended_ids) == top_n:
            break
    
    return {"recommended_imdb_ids": recommended_ids}


@app.post("/recommend")
def recommend_movies(data: MovieInput):
    return recommend_from_imdb_ids(data.imdb_ids, data.top_n)


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
