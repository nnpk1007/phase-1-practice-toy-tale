let addToy = false;
const toyCollection = document.querySelector("#toy-collection");

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  // make a 'GET' request to fetch all the toy objects
  fetch("http://localhost:3000/toys")
    .then((response) => response.json())
    .then((toys) => {
      toys.forEach((toy) => {
        //console.log(toy)
        createToy(toy);
      });
    });

  // A POST request should be sent to http://localhost:3000/toys and the new toy added to Andy's Toy Collection.
  // If the post is successful, the toy should be added to the DOM without reloading the page.
  const toyForm = document.querySelector(".add-toy-form");

  toyForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const image = e.target.image.value;
    const toyData = { name, image, likes: 0 };

    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(toyData),
    })
      .then((response) => response.json())
      .then((newToy) => {
        createToy(newToy);
      });
    e.target.reset();
  });

  // When a user clicks on a toy's like button, two things should happen:
  // A patch request (i.e., method: "PATCH") should be sent to the server at http://localhost:3000/toys/:id,
  // updating the number of likes that the specific toy has
  // If the patch is successful, the toy's like count should be updated in the DOM without reloading the page

  toyCollection.addEventListener("click", (e) => {
    if (e.target.matches(".like-btn")) {
      const id = e.target.dataset.id;
      console.log(id);
      const toy = document.getElementById(id);
      const likeCount = toy.querySelector("p");
      const currentLikes = parseInt(likeCount.innerText);
      const newLikes = currentLikes + 1;

      // send PATCH request to update toy's like
      fetch(`http://localhost:3000/toys/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },

        body: JSON.stringify({
          likes: newLikes,
        }),
      })
        .then((response) => {
          console.log(response);
          return response.json();
        })
        .then((updatedToy) => {
          likeCount.innerText = `${updatedToy.likes} Likes`;
        });
    }
  });
});

// create toy function
function createToy(toy) {
  const divToy = document.createElement("div");
  divToy.className = "card";
  divToy.setAttribute("id", toy.id);

  const h2 = document.createElement("h2");
  h2.innerText = toy.name;

  const img = document.createElement("img");
  img.setAttribute("src", toy.image);
  img.className = "toy-avatar";

  const p = document.createElement("p");
  p.innerText = toy.likes + " Likes";

  const btn = document.createElement("button");
  btn.setAttribute("data-id", toy.id);
  btn.className = "like-btn";
  btn.innerText = "Like";

  toyCollection.appendChild(divToy);
  divToy.appendChild(h2);
  divToy.appendChild(img);
  divToy.appendChild(p);
  divToy.appendChild(btn);
}
