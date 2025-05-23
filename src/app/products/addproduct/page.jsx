"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import arrowheader from "../../../assets/productimg/arrowheader.svg";
import Successicon from "../../../assets/productimg/Successicon.svg";
import trashbtnred from "../../../assets/productimg/trashbtnred.svg";
import saveicon from "../../../assets/productimg/saveicon.svg";
import TopNavbar from "../../../components/TopNavbar";
import {
  FaSave,
  FaTimes,
  FaBold,
  FaItalic,
  FaUnderline,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaAlignJustify,
  FaListUl,
  FaListOl,
  FaIndent,
  FaOutdent,
  FaLink,
  FaImage,
  FaPlus,
  FaExclamationTriangle,
} from "react-icons/fa";

import { products } from "../../../datastore/Products";
import { useRouter } from "next/navigation";

const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-1 mb-2">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-1 rounded ${
          editor.isActive("bold") ? "bg-gray-200" : ""
        }`}
      >
        <FaBold className="text-gray-700" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-1 rounded ${
          editor.isActive("italic") ? "bg-gray-200" : ""
        }`}
      >
        <FaItalic className="text-gray-700" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`p-1 rounded ${
          editor.isActive("underline") ? "bg-gray-200" : ""
        }`}
      >
        <FaUnderline className="text-gray-700" />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        className={`p-1 rounded ${
          editor.isActive({ textAlign: "left" }) ? "bg-gray-200" : ""
        }`}
      >
        <FaAlignLeft className="text-gray-700" />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        className={`p-1 rounded ${
          editor.isActive({ textAlign: "center" }) ? "bg-gray-200" : ""
        }`}
      >
        <FaAlignCenter className="text-gray-700" />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        className={`p-1 rounded ${
          editor.isActive({ textAlign: "right" }) ? "bg-gray-200" : ""
        }`}
      >
        <FaAlignRight className="text-gray-700" />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        className={`p-1 rounded ${
          editor.isActive({ textAlign: "justify" }) ? "bg-gray-200" : ""
        }`}
      >
        <FaAlignJustify className="text-gray-700" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-1 rounded ${
          editor.isActive("bulletList") ? "bg-gray-200" : ""
        }`}
      >
        <FaListUl className="text-gray-700" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-1 rounded ${
          editor.isActive("orderedList") ? "bg-gray-200" : ""
        }`}
      >
        <FaListOl className="text-gray-700" />
      </button>
      <button
        onClick={() =>
          editor
            .chain()
            .focus()
            .setLink({ href: prompt("URL", "https://") })
            .run()
        }
        className="p-1 rounded"
      >
        <FaLink className="text-gray-700" />
      </button>
      <button
        onClick={() => {
          const url = prompt("Image URL", "https://");
          if (url) {
            editor.chain().focus().setImage({ src: url }).run();
          }
        }}
        className="p-1 rounded"
      >
        <FaImage className="text-gray-700" />
      </button>
    </div>
  );
};

export default function EditProduct({ params }) {
  const findProduct = products.find(
    (product) => product.id === Number(params.id)
  );

  const router = useRouter();

  const [formData, setFormData] = useState({
    name: findProduct?.name || "",
    price: findProduct?.price || "",
    sku: findProduct?.sku || "",
    barcode: findProduct?.barcode || "",
    quantity: findProduct?.quantity || "",
    status: findProduct?.status || "Published",
    category: findProduct?.category || "",
    weight: findProduct?.weight || "",
    height: findProduct?.height || "",
    width: findProduct?.width || "",
    length: findProduct?.length || "",
    variations: findProduct?.variations || [],
    description: findProduct?.description || "",
    images: [],
    tags: findProduct?.tags || ["Watch", "Gadget"],
    discount: "",
    vat: "",
  });

  const [errors, setErrors] = useState({});

  const [tagInput, setTagInput] = useState("");
  const tagInputRef = useRef(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: formData.description || "<p></p>",
  });

  const validateNumericField = (name, value) => {
    if (value === "") return true;

    const numericFields = [
      "price",
      "quantity",
      "weight",
      "height",
      "width",
      "length",
      "discount",
      "vat",
    ];
    if (numericFields.includes(name)) {
      return !isNaN(parseFloat(value)) && isFinite(value);
    }
    return true;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (!validateNumericField(name, value)) {
      setErrors((prev) => ({
        ...prev,
        [name]: "This field must be a number",
      }));
      return;
    } else {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));
  };

  const updateVariation = (index, field, value) => {
    setFormData((prev) => {
      const updatedVariations = [...prev.variations];
      updatedVariations[index] = {
        ...updatedVariations[index],
        [field]: value,
      };
      return {
        ...prev,
        variations: updatedVariations,
      };
    });
  };

  const addVariation = () => {
    setFormData((prev) => ({
      ...prev,
      variations: [...prev.variations, { type: "Color", value: "" }],
    }));
  };

  const removeVariation = (index) => {
    setFormData((prev) => ({
      ...prev,
      variations: prev.variations.filter((_, i) => i !== index),
    }));
  };

  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
  };

  const handleTagInputKeyDown = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      addTag(tagInput.trim());
      setTagInput("");
    }
  };

  const addTag = (tag) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
      }));
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const focusTagInput = () => {
    if (tagInputRef.current) {
      tagInputRef.current.focus();
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
    }
    if (!formData.quantity.trim()) {
      newErrors.quantity = "Product quantity is required";
    }
    if (!formData.price.trim()) {
      newErrors.price = "Product price is required";
    }

    const editorContent = editor?.getHTML() || "";
    if (editorContent === "<p></p>" || !editorContent.trim()) {
      newErrors.description = "Product description is required";
    }
    const numericFields = [
      { name: "price", label: "Price" },
      { name: "quantity", label: "Quantity" },
      { name: "weight", label: "Weight" },
      { name: "height", label: "Height" },
      { name: "width", label: "Width" },
      { name: "length", label: "Length" },
      { name: "discount", label: "Discount" },
      { name: "vat", label: "VAT" },
    ];

    numericFields.forEach((field) => {
      if (
        formData[field.name] &&
        !validateNumericField(field.name, formData[field.name])
      ) {
        newErrors[field.name] = `${field.label} must be a number`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveProduct = () => {
    if (!validateForm()) {
      // Scroll to the first error
      const firstErrorField = document.querySelector(".error-field");
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    if (editor) {
      const editorContent = editor.getHTML();
      setFormData((prev) => ({
        ...prev,
        description: editorContent,
      }));
    }

    setTimeout(() => {
      const existingData =
        JSON.parse(localStorage.getItem("productData")) || [];

      const newProduct = {
        ...formData,
        id: Date.now(),
      };

      const updatedData = [...existingData, newProduct];

      localStorage.setItem("productData", JSON.stringify(updatedData));
      alert("Product added successfully! Redirecting to product list...");
      router.push(`/products`);
      console.log("All products:", updatedData);
    }, 0);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <TopNavbar />
      <div className="mx-auto p-4">
        <div className="flex justify-between items-center mb-6 flex-col md:flex-row">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              Add Product
            </h1>
            <div className="text-sm text-gray-500 flex items-center flex-wrap">
              <Link
                href="/dashboard"
                className="text-[#2086BF] hover:text-blue-500"
              >
                Dashboard
              </Link>
              <span className="mx-2">
                <Image
                  src={arrowheader}
                  alt=""
                  height={"auto"}
                  width={"auto"}
                />
              </span>
              <Link
                href="/products"
                className="text-[#2086BF] hover:text-blue-500"
              >
                Product List
              </Link>
              <span className="mx-2">
                <Image
                  src={arrowheader}
                  alt=""
                  height={"auto"}
                  width={"auto"}
                />
              </span>
              <span>Add Product</span>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4 md:mt-0">
            <Link href="/products">
              <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 flex items-center gap-1 cursor-pointer">
                <FaTimes className="text-gray-500" />
                <span>Cancel</span>
              </button>
            </Link>
            <button
              onClick={handleSaveProduct}
              className="px-4 py-2 bg-[#2086BF] text-white rounded-md flex items-center gap-1 cursor-pointer"
            >
              <Image src={saveicon} alt="" height={"auto"} width={"auto"} />
              <span>Save Product</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,3fr)_minmax(0,1fr)] gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-md shadow-sm p-6 mb-6">
              <h2 className="text-lg font-medium text-gray-800 mb-4">
                General Information
              </h2>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter product name"
                  className={`w-full p-2 border ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  } rounded-md text-gray-500 bg-gray-100 error-field`}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <FaExclamationTriangle className="mr-1" /> {errors.name}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <div
                  className={`border ${
                    errors.description ? "border-red-500" : "border-gray-300"
                  } rounded-md overflow-hidden text-gray-500 bg-gray-100 error-field`}
                >
                  <MenuBar editor={editor} />
                  <EditorContent editor={editor} className="p-2 min-h-32" />
                </div>
                {errors.description && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <FaExclamationTriangle className="mr-1" />{" "}
                    {errors.description}
                  </p>
                )}
              </div>
            </div>

            <div className="bg-white rounded-md shadow-sm p-6 mb-6">
              <h2 className="text-lg font-medium text-gray-800 mb-4">Media</h2>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Photos
              </label>
              <div className="bg-[#F9F9FC] p-4 py-5 flex flex-col gap-2 border-2 border-dashed border-[#E0E2E7]">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-w-xs mx-auto mt-2">
                  {formData.images.map((image, index) => (
                    <div
                      key={index}
                      className="relative aspect-square w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden"
                    >
                      <Image
                        src={URL.createObjectURL(image)}
                        alt={`Uploaded Image ${index + 1}`}
                        className="object-cover"
                        height={100}
                        width={100}
                      />
                      <div className="absolute top-1 right-2 p-1">
                        <Image
                          src={Successicon}
                          alt=""
                          height={"auto"}
                          width={"auto"}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-500 mb-2">
                    Drag and drop image here, or click add image
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="text-[#2086BF] bg-[#EAF8FF] p-2 rounded-sm text-sm cursor-pointer"
                  >
                    Add Image
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-md shadow-sm p-6 mb-6">
              <h2 className="text-lg font-medium text-gray-800 mb-4">
                Pricing
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Base Price <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500">
                      $
                    </span>
                    <input
                      type="text"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      className={`w-full p-2 pl-6 border ${
                        errors.price ? "border-red-500" : "border-gray-300"
                      } rounded-md text-gray-500 bg-gray-100 error-field`}
                    />
                  </div>
                  {errors.price && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <FaExclamationTriangle className="mr-1" /> {errors.price}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount Type
                  </label>
                  <select className="w-full p-2 border border-gray-300 rounded-md text-gray-500 bg-gray-100">
                    <option>No Discount</option>
                    <option>Percentage</option>
                    <option>Fixed Amount</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount Percentage (%)
                  </label>
                  <input
                    type="text"
                    name="discount"
                    value={formData.discount}
                    onChange={handleInputChange}
                    className={`w-full p-2 border ${
                      errors.discount ? "border-red-500" : "border-gray-300"
                    } rounded-md text-gray-500 bg-gray-100 error-field`}
                    placeholder="0%"
                  />
                  {errors.discount && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <FaExclamationTriangle className="mr-1" />{" "}
                      {errors.discount}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tax Class
                  </label>
                  <select className="w-full p-2 border border-gray-300 rounded-md text-gray-500 bg-gray-100">
                    <option>Tax Free</option>
                    <option>Standard Rate</option>
                    <option>Reduced Rate</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    VAT Amount (%)
                  </label>
                  <input
                    type="text"
                    name="vat"
                    value={formData.vat}
                    onChange={handleInputChange}
                    className={`w-full p-2 border ${
                      errors.vat ? "border-red-500" : "border-gray-300"
                    } rounded-md text-gray-500 bg-gray-100 error-field`}
                    placeholder="0%"
                  />
                  {errors.vat && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <FaExclamationTriangle className="mr-1" /> {errors.vat}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-md shadow-sm p-6 mb-6">
              <h2 className="text-lg font-medium text-gray-800 mb-4">
                Inventory
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    SKU
                  </label>
                  <input
                    type="text"
                    name="sku"
                    value={formData.sku}
                    onChange={handleInputChange}
                    placeholder="PROD-001"
                    className="w-full p-2 border border-gray-300 rounded-md text-gray-500 bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Barcode
                  </label>
                  <input
                    type="text"
                    name="barcode"
                    value={formData.barcode}
                    onChange={handleInputChange}
                    placeholder="123456789012"
                    className="w-full p-2 border border-gray-300 rounded-md text-gray-500 bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    placeholder="100"
                    className={`w-full p-2 border ${
                      errors.quantity ? "border-red-500" : "border-gray-300"
                    } rounded-md text-gray-500 bg-gray-100 error-field`}
                  />
                  {errors.quantity && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <FaExclamationTriangle className="mr-1" />{" "}
                      {errors.quantity}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-md shadow-sm p-6 mb-6">
              <h2 className="text-lg font-medium text-gray-800 mb-4">
                Variation
              </h2>
              <div className="py-1">
                {formData.variations.map((variation, index) => (
                  <div key={index} className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Variation Type
                      </label>
                      <select
                        className="w-full p-2 border border-gray-300 rounded-md text-gray-500 bg-gray-100"
                        value={variation.type}
                        onChange={(e) =>
                          updateVariation(index, "type", e.target.value)
                        }
                      >
                        <option value="Color">Color</option>
                        <option value="Size">Size</option>
                        <option value="Material">Material</option>
                      </select>
                    </div>
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Variation
                      </label>
                      <div className="flex items-center">
                        <input
                          type="text"
                          value={variation.value}
                          onChange={(e) =>
                            updateVariation(index, "value", e.target.value)
                          }
                          placeholder="Enter variation value"
                          className="w-full p-2 border border-gray-300 rounded-md text-gray-500 bg-gray-100"
                        />
                        <div className="ml-2 cursor-pointer">
                          <Image
                            src={trashbtnred}
                            alt=""
                            height={"auto"}
                            width={"auto"}
                            onClick={() => removeVariation(index)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  onClick={addVariation}
                  className="flex items-center text-[#2086BF] text-sm mt-2 hover:bg-blue-100 bg-[#EAF8FF] p-2 rounded-sm cursor-pointer"
                >
                  <FaPlus className="mr-1" /> Add Variant
                </button>
              </div>
            </div>

            <div className="bg-white rounded-md shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-800 mb-4">
                Shipping
              </h2>
              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked
                    className="form-checkbox h-4 w-4 accent-[#2086BF]"
                  />
                  <span className="ml-2 text-sm text-[#2086BF]">
                    This is a physical product
                  </span>
                </label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Weight
                  </label>
                  <input
                    type="text"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    placeholder="0.0 kg"
                    className={`w-full p-2 border ${
                      errors.weight ? "border-red-500" : "border-gray-300"
                    } rounded-md text-gray-800 bg-gray-100 error-field`}
                  />
                  {errors.weight && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <FaExclamationTriangle className="mr-1" /> {errors.weight}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Height
                  </label>
                  <input
                    type="text"
                    name="height"
                    value={formData.height}
                    onChange={handleInputChange}
                    placeholder="0.0 cm"
                    className={`w-full p-2 border ${
                      errors.height ? "border-red-500" : "border-gray-300"
                    } rounded-md text-gray-800 bg-gray-100 error-field`}
                  />
                  {errors.height && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <FaExclamationTriangle className="mr-1" /> {errors.height}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Length
                  </label>
                  <input
                    type="text"
                    name="length"
                    value={formData.length}
                    onChange={handleInputChange}
                    placeholder="0.0 cm"
                    className={`w-full p-2 border ${
                      errors.length ? "border-red-500" : "border-gray-300"
                    } rounded-md text-gray-800 bg-gray-100 error-field`}
                  />
                  {errors.length && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <FaExclamationTriangle className="mr-1" /> {errors.length}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Width
                  </label>
                  <input
                    type="text"
                    name="width"
                    value={formData.width}
                    onChange={handleInputChange}
                    placeholder="0.0 cm"
                    className={`w-full p-2 border ${
                      errors.width ? "border-red-500" : "border-gray-300"
                    } rounded-md text-gray-800 bg-gray-100 error-field`}
                  />
                  {errors.width && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <FaExclamationTriangle className="mr-1" /> {errors.width}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-md shadow-sm p-6 mb-6">
              <h2 className="text-lg font-medium text-gray-800 mb-4">
                Category
              </h2>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md text-gray-500 bg-gray-100"
                >
                  <option>Watch</option>
                  <option>Electronics</option>
                  <option>Accessories</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Tags
                </label>
                <div
                  onClick={focusTagInput}
                  className="flex items-center flex-wrap border border-gray-300 rounded-md bg-gray-100 p-1 gap-2 py-1 min-h-12"
                >
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 p-0.5  bg-[#EAF8FF] text-[#2086BF] text-xs rounded-sm"
                    >
                      {tag}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeTag(tag);
                        }}
                        className="ml-2 text-[#2086BF] cursor-pointer "
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <input
                    ref={tagInputRef}
                    type="text"
                    value={tagInput}
                    onChange={handleTagInputChange}
                    onKeyDown={handleTagInputKeyDown}
                    placeholder={
                      formData.tags.length ? "" : "Type tag and press Enter"
                    }
                    className="outline-none border-none bg-transparent px-1 text-sm flex-grow min-w-20 text-gray-500"
                  />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-md shadow-sm p-6 mb-6">
              <h2 className="text-lg font-medium text-gray-800 mb-4">Status</h2>
              <div className="mb-4">
                <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                  Published
                </span>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md text-gray-500 bg-gray-100"
                >
                  <option>Published</option>
                  <option>Draft</option>
                  <option>Archived</option>
                </select>
              </div>
            </div>
            {Object.keys(errors).length > 0 && (
              <div className="bg-red-50 rounded-md shadow-sm p-6 mb-6 border border-red-200">
                <h2 className="text-lg font-medium text-red-800 mb-2 flex items-center">
                  <FaExclamationTriangle className="mr-2" /> Validation Issues
                </h2>
                <ul className="list-disc list-inside text-red-700 text-sm">
                  {Object.entries(errors).map(([field, message]) => (
                    <li key={field} className="mb-1">
                      {message}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
