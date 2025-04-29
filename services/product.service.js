import Category from "../modals/category.modal.js";
import Product from "../modals/product.modal.js";

const createProduct = async (reqData) => {
  try {
    let topLevel = await Category.findOne({ name: reqData.topLevelCategory });

    if (!topLevel) {
      topLevel = new Category({
        name: reqData.topLevelCategory,
        level: 1,
      });
      await topLevel.save()
    }
    let secondLevel = await Category.findOne({
      name: reqData.secondLevelCategory,
    });
    if (!secondLevel) {
      secondLevel = new Category({
        name: reqData.secondLevelCategory,
        parentCategory: topLevel._id,
        level: 2,
      });
      await secondLevel.save()
    }
    let thirdLevel = await Category.findOne({
      name: reqData.thirdLevelCategory,
    });
    if (!thirdLevel) {
      thirdLevel = new Category({
        name: reqData.thirdLevelCategory,
        parentCategory: secondLevel._id,
        level: 3,
      });
      await thirdLevel.save()
    }

    const product = new Product({
      title: reqData.title,
      description: reqData.description,
      price: reqData.price,
      discountedPercent: reqData.discountedPercent,
      discountedPrice: reqData.discountedPrice,
      brand: reqData.brand,
      colors: reqData.colors,
      category: thirdLevel._id,
      imageUrl: reqData.imageUrl,
      size: reqData.size,
      quantity: reqData.quantity,
      numRatings: reqData.numRatings,
      ratings: reqData.ratings,
      reviews: reqData.reviews,
    });
    return await product.save();
  } catch (error) {
    throw new Error(error.message);
  }
};
const deleteProductById = async (productId) => {
  try {
    const productDeleted = await Product.findByIdAndDelete(productId);
    return `product deleted successfully${productDeleted}`;
  } catch (error) {
    throw new Error("product cannot be deleted ", error.message);
  }
};
const findProductById = async (productId) => {
  try {
    const product = await Product.findById(productId)
    
    .populate("category")
    

      .exec();

  
    return product;
  } catch (error) {
   

    throw new Error("product not found",error.message);
  }
};

const updateProductById = async (productId, updatedData) => {
  try {
    return Product.findByIdAndUpdate(productId, updatedData);
  } catch (error) {
    throw new Error("product cannot be updated");
  }
};

const getAllProducts = async (reqQuery) => {  
  try {     
    let { category, size, color, minPrice, maxprice, sort, brands,stock, minDiscount, pageNumber = 1, pageSize = 10 } = reqQuery; 
    
    // Convert pageSize and pageNumber to numbers
    pageNumber = Number(pageNumber);
    pageSize = Number(pageSize);

    if (isNaN(pageNumber) || pageNumber <= 0) pageNumber = 1;
    if (isNaN(pageSize) || pageSize <= 0) pageSize = 10;

 
    let query = Product.find().populate("category");


    // Filtering by categorys
    if(category&&category.toString()!=="Tshirt")
    {category=category.toLowerCase()}
    if (category) {
      const existingCategory = await Category.findOne({ name: category });
      if (existingCategory) {
        query = query.where("category").equals(existingCategory._id);
      } else {
        return { content: [], totalPages: 0, currentPage: pageNumber };
      }
    }

    // Filtering by brands
    if (reqQuery.brands) {
      const brandSet = new Set(reqQuery.brands.split(",").map((brand) => brand.trim().toLowerCase()));
      query = query.where("brand").in([...brandSet]);
    }

    // Filtering by colors
    if (color) {
      const colorSet = new Set(color.split(",").map((color) => color.trim().toLowerCase()));
      const colorRegex = colorSet.size > 0 ? new RegExp([...colorSet].join("|"), "i") : null;
      query = query.where("colors").regex(colorRegex);
    }

    // Filtering by sizes
    if (size) {
      const sizeSet = new Set(size);
      query = query.where("size.name").in([...sizeSet]);
    }

    // Filtering by price range
    if (minPrice && maxprice) {
      query = query.where("discountedPrice").gte(minPrice).lte(maxprice);
    }

    // Filtering by minimum discount
    if (minDiscount) {
      query = query.where("discountedPercent").gte(minDiscount);
    }

    // Filtering by stock status
    if (stock) {
      if (stock === "in_stock") {
        query = query.where("quantity").gt(0);
      } else if (stock === "out_of_stock") {
        query = query.where("quantity").lte(0);
      }
    }

    // Sorting
    if (sort) {
      const sortDirection = sort === "price_high" ? -1 : 1;
      query = query.sort({ discountedPrice: sortDirection });
    }

    // Count total products matching the query
    const totalProducts = await Product.countDocuments(query);
 

    // Pagination logic
    const skip = (pageNumber - 1) * pageSize;
    query = query.skip(skip).limit(pageSize);

    // Execute query to get products
    const products = await query.exec();
    
    // Calculate total pages for pagination
    const totalPages = Math.ceil(totalProducts / pageSize);
   

    // Return paginated products

    return { content: products, totalPages, currentPage: pageNumber };

  } catch (error) {
    console.log(error);
    throw new Error(`Error fetching products: ${error.message || 'unknown error'}`);
  }
};

const createMultipleProducts = async (products) => {
  try {
    for (let product of products) {
      await createProduct(product);
    }
  } catch (error) {
    throw new Error("products cannot be created");
  }
};
export default {
  createProduct,
  deleteProductById,
  findProductById,
  updateProductById,
  getAllProducts,
  createMultipleProducts,
};
