use wasm_bindgen::prelude::*;
use html_parser::{Dom};

#[wasm_bindgen]
pub fn parse(html: &str) -> String {
    let result = match Dom::parse(html) {
        Ok(result) => {
            match result.to_json_pretty() {
                Ok(result) => result,
                Err(_) => String::from("parse error")
            }
        }
        Err(_) => String::from("json error")
    };

    result
}
